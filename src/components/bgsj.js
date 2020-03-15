let sjcolumns = [{
        label: "姓名",
        prop: "customername"
    },

    {
        label: "客户旺旺",
        prop: "wangwang"
    },
    {
        label: "性别",
        prop: "gender"
    },
    {
        label: "体重",
        prop: "weight"
    },
    {
        label: "电话",
        prop: "tel"
    },




    {
        label: "粉丝福利",
        prop: "fanWelware"
    },
    {
        label: "粉丝级别",
        prop: "fansLevel",
        options: [{
                value: '新粉',
                label: '新粉'
            },
            {
                value: '铁粉',
                label: '铁粉'
            },
            {
                value: '钻粉',
                label: '钻粉'
            },
            {
                value: '挚爱粉',
                label: '挚爱粉'
            },
        ]
    },
    {
        label: "客户来源",
        prop: "source",
        options: [{
                value: '微信老客户',
                label: '微信老客户'
            },
            {
                value: '天猫客户',
                label: '天猫客户'
            },

        ]
    },
    {
        label: "购买能力",
        prop: "purchaseAbility"
    },

    {
        label: "忌口",
        prop: "hate"
    },
    {
        label: "购买偏好",
        prop: "likeProduct"
    },
    {
        label: "购买时间",
        prop: "purchaseTime"
    },

    {
        label: "购买金额(元)",
        prop: "purchaseMoney"
    },
    {
        label: "客户体验",
        prop: "customerFeel"
    },
    {
        label: "消耗时间(天)",
        prop: "useTime"
    },
    {
        label: "开单微信号",
        prop: "wechatNo"
    },
    // {
    //   label: "开单人员",
    //   prop: "billingPerson"
    // },
    {
        label: "产品名称",
        prop: "productName"
    },
    {
        label: "数量",
        prop: "number"
    }, {
        label: "地址",
        prop: "address"
    },

]
let ddglsj = [{
        prop: "index",
        label: "序号"
    },
    {
        prop: "wangwang",
        label: "客户旺旺"
    },
    {
        prop: "orderNo",
        label: "订单编号"
    },
    {
        prop: "orderTime",
        label: "下单日期"
    },
    {
        prop: "endOrderTime",
        label: "交单日期"
    },
    {
        prop: "productName",
        label: "产品名称"
    },

    {
        prop: "count",
        label: "数量"
    },
    {   
        prop: "customerFeel",
        label: "客户体验"
    },
    {
        prop: "isProcess",
        label: "处理结果"
    },
    {
        prop: "money",
        label: "金额(元）"
    },
    {
        prop: "profit",
        label: "利润(元）"
    },
    {
        prop: "salemanName",
        label: "业务员"
    },
    {
        prop: "remark",
        label: "备注"
    }
]
let gdjlsj = [{
            prop: "wangwang",
            label: "客户旺旺"
        },
        {
            prop: "followTime",
            label: "跟单时间"
        },
        {
            prop: "type",
            label: "跟单类型",
            option: [{
                    value: '微信跟进',
                    label: '微信跟进'
                },
                {
                    value: '直播跟进',
                    label: '直播跟进'
                },
            ]
        },
        {
            prop: "process",
            label: "跟单进度",
            option: [{
                    value: '无意向',
                    label: '无意向'
                },
                {
                    value: '有意向',
                    label: '有意向'
                },
                {
                    value: '已下单',
                    label: '已下单'
                },

            ]
        },

        {
            prop: "remark",
            label: "详情备注"
        },

        {
            prop: "nextLinktime",
            label: "下次联系"
        },
        {
            prop: "linkMan",
            label: "联系人"
        }
    ]
    // function time() {


// }
export default {
    sjcolumns,
    ddglsj,
    gdjlsj
    // time
}