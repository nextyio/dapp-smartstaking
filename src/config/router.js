import HomePage from '@/module/page/home/Container'
import DashboardPage from '@/module/page/dashboard/Container'
import LoginPage from '@/module/page/login/Container'
import RegisterPage from '@/module/page/register/Container'
import ProfilePage from '@/module/page/profile/Container'

import NotFound from '@/module/page/error/NotFound'

export default [
    {
        path: '/',
        page: HomePage
    },
    {
        path: '/home',
        page: HomePage
    },
    {
        path: '/dashboard',
        page: DashboardPage
    },
    {
        path: '/login',
        page: LoginPage
    },
    {
        path: '/register',
        page: RegisterPage
    },
    {
        path: '/profile',
        page: ProfilePage
    },
    {
        page: NotFound
    }
]
