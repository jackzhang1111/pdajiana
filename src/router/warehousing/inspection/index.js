//稽查
import inspectionList from '@/components/tabbar/warehousing/inspection/inspectionList.vue'
import inspectionError from '@/components/tabbar/warehousing/inspection/inspectionError.vue'
import inspectionDetail from '@/components/tabbar/warehousing/inspection/inspectionDetail.vue'
let routes = [
    {
        path: 'inspectionList',
        name: 'inspectionList',
        component: inspectionList
    },
    {
        path: 'inspectionError',
        name: 'inspectionError',
        component: inspectionError
    },
    {
        path: 'inspectionDetail',
        name: 'inspectionDetail',
        component: inspectionDetail
    },
];

export default routes;