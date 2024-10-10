import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import JobView from '@/views/JobView.vue';
import AddJobView from '@/views/AddJobView.vue';
import EditJobView from '@/views/EditJobView.vue';
import ServerView from '@/views/ServerView.vue';
import PayView from '@/views/PayView.vue';
import PowerView from '@/views/PowerView.vue';
import DeviceView from '@/views/DeviceView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/power',
      name: 'power',
      component: PowerView,
    },
    {
      path: '/pay',
      name: 'pay',
      component: PayView,
    },
    {
      path: '/device',
      name: 'device',
      component: DeviceView,
    },
    {
      path: '/server',
      name: 'server',
      component: ServerView,
    },
    {
      path: '/jobs/:id',
      name: 'job',
      component: JobView,
    },
    {
      path: '/jobs/add',
      name: 'add-job',
      component: AddJobView,
    },
    {
      path: '/jobs/edit/:id',
      name: 'edit-job',
      component: EditJobView,
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

export default router;
