
/**@param option: {page : number, pagesize : number, total : number, action : string} */
function createPagination(option) {
    var currentpage = parseInt('' + option.page);
    var pagesize = Math.ceil(parseFloat('' + option.pagesize));
    var total = Math.ceil(parseFloat('' + option.total));
    if (total == 0 || total == undefined || total <= pagesize) { $('ul.pagination').html(''); return; }
    var html = ""
    var pageCount = option.count ? Math.ceil(option.count) : Math.ceil(total / pagesize);
    html += '<li class="page-item">' +
        '<a href="javascript:void(0);" class="page-link" onclick="' + option.action + '(1)" aria-label="Previous">' +
        '<span aria-hidden="true">&laquo;</span>' +
        '<span class="sr-only">Previous</span>' +
        '</a>' +
        '</li>';
    var display = [];
    display.push(1)
    if (pageCount > 1 && pageCount <= 10) {
        for (var i = 2; i <= pageCount; i++) {
            display.push(i);
        }
    } else if (pageCount > 10) {
        for (var u = currentpage - 3; u < currentpage + 4; u++) {
            if (u < pageCount && u > 1) {
                display.push(u);
            }
        }
        for (var j = pageCount - 5; j < pageCount; j++) {
            if (j > 1 && display.indexOf(j) == -1 && display.length < 8) {
                display.push(j);
            }
        }
        if (display.indexOf(pageCount - 1) == -1) {
            display.push(pageCount - 1);
        }
        if (display.indexOf(pageCount) == -1) {
            display.push(pageCount)
        }
    }
    display.sort(function (a, b) { return a - b });
    var myArray = [1];
    for (var k = 1; k < display.length; k++) {
        if ((display[k - 1] + 1) != display[k]) {
            myArray.push('...');
        }
        myArray.push(display[k]);
    }
    myArray.forEach(function (elem) {
        html += '<li class="page-item ' + (elem == currentpage ? 'active' : '') + '"><a class="page-link" ' + (elem != '...' ? ' onclick="' + option.action + '(' + elem + ')"' : '') + '>' + elem + '</a></li>';
    })
    html += '<li class="page-item">' +
        '<a class="page-link" onclick="' + option.action + '(' + pageCount + ')" aria-label="Next">' +
        '<span aria-hidden="true">&raquo;</span>' +
        '<span class="sr-only">Next</span>' +
        '</a>' +
        '</li>';
    $('ul.pagination').html(html);
    topFunction();
}

/**@param pagesize : int : number records display */
function createShowTools(pagesize) {
    pagesize = parseInt(pagesize);
    return '<label style="margin: 5px; right:15px;">Show <select name="page_size" class="form-control" style="width:50px; padding:2px;">' +
        '<option value="10" ' + (pagesize == 10 ? 'selected' : '') + '>10</option>' +
        '<option value="25" ' + (pagesize == 25 ? 'selected' : '') + '>25</option>' +
        '<option value="50" ' + (pagesize == 50 ? 'selected' : '') + '>50</option>' +
        '<option value="100" ' + (pagesize == 100 ? 'selected' : '') + '>100</option>' +
        '<option value="200" ' + (pagesize == 200 ? 'selected' : '') + '>200</option>' +
        '<option value="500" ' + (pagesize == 500 ? 'selected' : '') + '>500</option>' +
        '<option value="1000" ' + (pagesize == 1000 ? 'selected' : '') + '>1000</option>' +
        '</select></label>';
}
