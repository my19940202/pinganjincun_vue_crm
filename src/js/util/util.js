
export const ajaxSetupCSRF = () => {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
};

export function getCookie(name) {
    let arr = [];
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    if (arr = document.cookie.match(reg)) {
        let value = unescape(arr[2]);
        return value;
    }
    else {
        return '';
    }
}


export function genDateStr(AddDayCount) {
    let dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);
    let y = dd.getFullYear();
    let m = dd.getMonth() + 1;
    let d = dd.getDate();
    return `${y}-${m}-${d}`;
}

export function getTomorrow(params) {
    // let params = '2006-11-25';
    let dtArr = params.split('-');
    let dd = new Date(dtArr[0], dtArr[1] - 1, dtArr[2]);
    dd.setDate(dd.getDate() + 1);
    let y = dd.getFullYear();
    let m = dd.getMonth() + 1;
    let d = dd.getDate();
    return `${y}-${m}-${d}`;
}