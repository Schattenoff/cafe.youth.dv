<script>
export default {
    props: {
        label: { type: String, required: true }
    },

    emits: ['close'],

    data() {
        return {
            drag: null,
            dragOffset: 0,
            hasDragged: false,
            touch: null,
            isClosing: false
        };
    },

    methods: {
        async requestClose() {
            if (this.isClosing) return;
            this.isClosing = true;

            const dialog = this.$refs.dialog;
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                const currentTransform = getComputedStyle(dialog).transform;
                const animation = dialog.animate([
                    { transform: currentTransform },
                    { transform: 'translateY(100%)' }
                ], { duration: 220, easing: 'ease-in', fill: 'forwards' });

                try {
                    await animation.finished;
                } catch {
                    // Диалог может исчезнуть при смене страницы.
                }
            }

            if (dialog.isConnected) this.$emit('close');
        },

        startTouch(event) {
            this.touch = null;
            if (this.isClosing || event.touches.length !== 1) return;

            const scrollAreas = [];
            for (let element = event.target; element && element !== this.$refs.dialog; element = element.parentElement) {
                if (/auto|scroll/.test(getComputedStyle(element).overflowY)) {
                    scrollAreas.push(element);
                }
            }

            const finger = event.touches[0];
            this.touch = { x: finger.clientX, y: finger.clientY, scrollAreas };
        },

        moveTouch(event) {
            if (!this.touch || this.isClosing || event.touches.length !== 1) return;

            const finger = event.touches[0];
            const distance = finger.clientY - this.touch.y;
            if (!this.drag) {
                const isDownward = distance > 6 && distance > Math.abs(finger.clientX - this.touch.x);
                const isAtTop = this.touch.scrollAreas.every(area => area.scrollTop <= 0);
                if (!isDownward || !isAtTop || !event.cancelable) return;
                this.drag = { pointerId: null };
                this.hasDragged = true;
            }

            event.preventDefault();
            this.dragOffset = Math.max(0, distance);
        },

        endTouch(event) {
            this.touch = null;
            if (this.drag?.pointerId !== null) return;

            this.drag = null;
            if (event.type === 'touchend' && this.dragOffset >= 40) {
                this.requestClose();
            } else {
                this.dragOffset = 0;
            }
        },

        startDrag(event) {
            if (event.pointerType === 'touch' || event.button !== 0 || this.drag || this.isClosing) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            this.hasDragged = true;
            this.drag = { pointerId: event.pointerId, startY: event.clientY };
        },

        moveDrag(event) {
            if (this.drag?.pointerId !== event.pointerId) return;
            this.dragOffset = Math.max(0, event.clientY - this.drag.startY);
        },

        endDrag(event) {
            if (this.drag?.pointerId !== event.pointerId) return;
            const shouldClose = event.type === 'pointerup' && event.clientY - this.drag.startY >= 40;
            this.drag = null;
            if (shouldClose) {
                this.requestClose();
            } else {
                this.dragOffset = 0;
            }
        }
    },

    mounted() {
        this.$refs.dialog.showModal();
    },

    beforeUnmount() {
        this.$refs.dialog.close();
    }
}
</script>

<template>
    <dialog ref="dialog" class="curtain" :aria-label="label"
            :class="{ 'curtain--dragging': drag, 'curtain--closing': isClosing, 'curtain--dragged': hasDragged }" :style="{ transform: `translateY(${dragOffset}px)` }"
            @cancel.prevent="requestClose" @click.self="requestClose"
            @touchstart.passive="startTouch" @touchmove="moveTouch"
            @touchend="endTouch" @touchcancel="endTouch">
        <div class="curtain__handle" aria-hidden="true"
             @pointerdown="startDrag" @pointermove="moveDrag" @pointerup="endDrag"
             @pointercancel="endDrag" @lostpointercapture="endDrag"></div>
        <slot :close="requestClose" />
    </dialog>
</template>

<style scoped>
:global(html:has(.curtain[open])) {
    overflow: hidden;
}


.curtain {
    --curtain-handle-height: 24px;
    position: fixed;
    inset: auto 0 0;
    width: min(100%, 520px);
    max-width: none;
    max-height: none;
    margin: 0 auto;
    border: 0;
    border-radius: 30px 30px 0 0;
    overflow: hidden;
    box-shadow: 0 -8px 32px #0002;
    transition: transform 160ms ease-out;
}

.curtain--dragging,
.curtain--closing {
    transition: none;
}

.curtain__handle {
    display: grid;
    place-items: center;
    height: var(--curtain-handle-height);
    touch-action: none;
    user-select: none;
    cursor: grab;
}

.curtain__handle::before {
    content: "";
    width: 36px;
    height: 4px;
    border-radius: 4px;
    background: #d5d5d5;
}

.curtain[open]:not(.curtain--dragged):not(.curtain--closing) {
    animation: slide-in 220ms ease-out;
}

.curtain::backdrop {
    background: #0006;
    transition: opacity 220ms ease-in;
}

.curtain--closing::backdrop {
    opacity: 0;
}

@keyframes slide-in {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
    .curtain {
        transition: none;
    }

    .curtain[open]:not(.curtain--dragged):not(.curtain--closing) {
        animation: none;
    }
}
</style>
