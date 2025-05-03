import {createRouter, createWebHistory} from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import PanelView from "@/views/PanelView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/panel',
            component: PanelView,
            children: [
                {
                    path: '',
                    redirect: 'panel/orders'
                },
                {
                    path: 'orders',
                    name: 'orders',
                    component: PanelView
                },
                {
                    path: 'menu',
                    name: 'menu',
                    component: PanelView
                },
            ]
        }
    ]
})

export default router;
