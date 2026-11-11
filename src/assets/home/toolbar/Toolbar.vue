<script>
export default {
    props: {
        total: { type: String, required: true },
        cartOpen: Boolean
    },

    emits: ['menu', 'cart'],

    methods: {
        animateAdd(source) {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const icon = this.$refs.cartIcon;
            const from = source.getBoundingClientRect();
            const to = icon.getBoundingClientRect();
            const dx = to.left + to.width / 2 - (from.left + from.width / 2);
            const dy = to.top + to.height / 2 - (from.top + from.height / 2);
            const dot = this.$refs.dot.cloneNode();
            dot.hidden = false;
            dot.style.left = `${from.left + from.width / 2}px`;
            dot.style.top = `${from.top + from.height / 2}px`;
            this.$el.append(dot);

            const lift = Math.min(145, Math.max(24, from.top - 12));
            // Кубическая кривая поднимает кружок вертикально и ведёт его к иконке сверху.
            const frames = Array.from({ length: 31 }, (_, index) => {
                const t = index / 30;
                const remaining = 1 - t;
                const approach = 3 * remaining * t ** 2;
                const x = approach * dx * .88 + t ** 3 * dx;
                const y = -3 * remaining ** 2 * t * lift
                    + approach * (dy - 115) + t ** 3 * dy;
                const landing = Math.max(0, (t - .78) / .22);

                return {
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${1 - .75 * landing})`,
                    opacity: 1 - landing
                };
            });
            const flight = dot.animate(frames, { duration: 620, easing: 'cubic-bezier(.24,.45,.5,1)' });

            flight.finished.then(() => {
                if (icon.isConnected) {
                    icon.animate([
                        { transform: 'translateY(0)' },
                        { transform: 'translateY(-4px) scale(1.12)' },
                        { transform: 'translateY(0)' }
                    ], { duration: 230, easing: 'ease-out' });
                }
            }, () => {}).finally(() => dot.remove());
        }
    }
}
</script>

<template>
    <nav class="toolbar" aria-label="Меню и корзина">
        <button type="button" class="toolbar__button" :aria-current="cartOpen ? null : 'page'"
                @click="$emit('menu')">
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h2m4 0h10M4 12h2m4 0h10M4 18h2m4 0h10" />
            </svg>
            Меню
        </button>
        <button type="button" class="toolbar__button" aria-haspopup="dialog" :aria-expanded="cartOpen"
                :aria-label="Number(total) > 0 ? `Корзина, ${total} руб.` : 'Корзина'" @click="$emit('cart')">
            <svg ref="cartIcon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 4h2l2.2 10h11.5L21 7H6" />
                <circle cx="9" cy="19" r="1" />
                <circle cx="18" cy="19" r="1" />
            </svg>
            <span>{{ Number(total) > 0 ? `${total} руб.` : 'Корзина' }}</span>
        </button>
        <span ref="dot" class="toolbar__dot" aria-hidden="true" hidden></span>
    </nav>
</template>

<style scoped>
.toolbar {
    position: fixed;
    inset: auto 0 calc(10px + env(safe-area-inset-bottom));
    width: min(calc(100% - 28px), 240px);
    margin-inline: auto;
    z-index: 20;
    display: flex;
    justify-content: center;
    border: 1px solid var(--cafe-line);
    border-radius: 999px;
    padding: 6px;
    gap: 5px;
    box-shadow: 0 8px 28px #2336301c, 0 2px 6px #2336300d;
    background: rgb(255 255 255 / 88%);
    -webkit-backdrop-filter: blur(16px);
    backdrop-filter: blur(16px);
}

.toolbar__button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    min-width: 0;
    flex: 1;
    min-height: 54px;
    padding: 5px 10px;
    border-radius: 999px;
    border: 0;
    background: transparent;
    color: var(--cafe-muted);
    font: 600 12px/16px "Montserrat", sans-serif;
    cursor: pointer;
}

.toolbar__button:hover {
    background: var(--cafe-soft);
}

.toolbar__button[aria-current="page"],
.toolbar__button[aria-expanded="true"] {
    background: #edf1f5;
    color: #273b4d;
}

.toolbar svg {
    flex: none;
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
}
.toolbar__dot {
    position: fixed;
    z-index: 1;
    width: 15px;
    height: 15px;
    border: 2px solid white;
    border-radius: 50%;
    background: var(--cafe-accent);
    box-shadow: 0 2px 8px #36735f55;
    pointer-events: none;
}
</style>
