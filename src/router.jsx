import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router';
import ProjectManager from './pages/ProjectManager';
import Login from './pages/Login';
import Register from './pages/Register';
// import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import Home from './pages/Home';
import Layout from './components/common/Layout';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: ProjectManager,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
});

// const profileRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/profile',
//   component: Profile,
// });

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const paymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payments',
  component: Payments,
});

const routeTree = rootRoute.addChildren([indexRoute, projectsRoute, loginRoute, registerRoute, dashboardRoute, paymentsRoute]);

const router = createRouter({ routeTree });

export default router;

