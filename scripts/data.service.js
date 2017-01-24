 angular.module('Servicess').factory('dataService', dataService);
function dataService() {
    function getData(rows, cols) {
        var arrData = [];
        var headers = [];
        var rowObj = {};
        var rowName;
        
        for(var i = 0; i < rows; i++) {
            rowName = 'row_' + i;
            rowObj = {};

             for(var j = 0; j < cols; j++) {
                rowObj['col_' + j] = 'col_'+ i + '_' + j;
            }
            arrData.push(rowObj);
        }

        // return function () {
        //     var page  = parseInt(window.location.hash.replace('#', ''), 10) || 1,
        //         limit = 20,
        //         row   = (page - 1) * limit,
        //         count = page * limit,
        //         part  = [];

        //     for (;row < count;row++) {
        //         part.push(arrData[row]);
        //     }

        //     return part;
        // }

        return function () {
            return arrData;
        }
            
    }

    function getHeaders(cols) {
        var headers = [];
        for(var j = 0; j < cols; j++) {
            headers.push('col_'+ j);
        }

        return headers;
    }

    return {
        getData: getData,
        getHeaders: getHeaders
    }
 }
