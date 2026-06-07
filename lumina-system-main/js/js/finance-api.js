/* ============================================
   卢米纳电子 — 财务端 API 请求封装层
   ============================================ */

var FINANCE_API_BASE = '/api/v1/finance';

// 内部请求函数
function financeGet(path, params) {
    var queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetch(FINANCE_API_BASE + path + queryString)
        .then(function(r) { return r.json(); })
        .then(function(d) {
            if (d.code !== 200 && d.code !== 0) throw new Error(d.message || '请求失败');
            return d.data || d;
        });
}

function financePost(path, body) {
    return fetch(FINANCE_API_BASE + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
        .then(function(r) { return r.json(); })
        .then(function(d) {
            if (d.code !== 200 && d.code !== 0) throw new Error(d.message || '请求失败');
            return d.data || d;
        });
}

// 财务端API
window.FinanceAPI = {
    // 工作台
    getDashboard: function() { return financeGet('/dashboard'); },
    getTodoList: function() { return financeGet('/todo-list'); },
    
    // 应收账款
    getReceivableList: function(params) { return financeGet('/receivable', params); },
    writeOff: function(orderNo, amount) { 
        return financePost('/receivable/write-off', { orderNo: orderNo, amount: amount });
    },
    getUrgeHistory: function(orderNo) { return financeGet('/receivable/urge-history/' + orderNo); },
    saveUrgeRecord: function(data) { return financePost('/receivable/urge-record', data); },
    saveAlertRules: function(rules) { return financePost('/receivable/alert-rules', rules); },
    
    // 退款审核
    getRefundList: function(params) { return financeGet('/refund/list', params); },
    getRefundDetail: function(returnNo) { return financeGet('/refund/detail/' + returnNo); },
    approveRefund: function(data) { return financePost('/refund/approve', data); },
    rejectRefund: function(data) { return financePost('/refund/reject', data); },
    
    // 审计日志
    getAuditLogs: function(params) { return financeGet('/audit-log', params); },
    
    // 催办通知
    sendUrge: function(data) { return financePost('/notification/urge', data); },
    
    // 报表导出
    getReportUrl: function(reportType, params) {
        var queryString = params ? '?' + new URLSearchParams(params).toString() : '';
        return FINANCE_API_BASE + '/report/' + reportType + queryString;
    }
};
