//上报
import reportingList from '@/components/tabbar/warehousing/reporting/reportingList.vue'
import reportingDetail from '@/components/tabbar/warehousing/reporting/reportingDetail.vue'
import reportingUpload from '@/components/tabbar/warehousing/reporting/reportingUpload.vue'
let routes = [
    {
        path: 'reportingList',
        name: 'reportingList',
        component: reportingList
    },
    {
        path: 'reportingDetail',
        name: 'reportingDetail',
        component: reportingDetail
    },
    {
        path: 'reportingUpload',
        name: 'reportingUpload',
        component: reportingUpload
    },
];

export default routes;