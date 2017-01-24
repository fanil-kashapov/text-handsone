angular.module('Test').directive('excel', excel);
excel.$inject = ['dataService'];

function excel(dataService) {
    return {
        restrict: 'E',
        template: ' <button ng-click="generate()">Generate Excell</button> \
                        <label for="rowNumber"></label><input type="text" name="rowNumber" ng-model="rowsNumber"> \
                        <label for="colNumber"></label><input type="text" name="colNumber" ng-model="colsNumber"> \
                        <div class="excel-holder-main" style="width: calc(100% - 240px); float: left" > \
                            <div class="excel-holder" style="overflow: hidden" set-full-screen-heigth> \
                                <div id="matrix-yearly-excel"></div> \
                            </div> \
                        </div> \
                        <div class="excel-holder-total" style="width: 240px"> \
                            <div class="excel-holder" style="overflow: hidden" set-full-screen-heigth> \
                                <div id="matrix-total-excel"></div> \
                            </div> \
                        </div> \
                    </div>',
        link: function(scope, elem) {
            var $excelElem = elem.find('#matrix-yearly-excel')[0];
            var $excelElem2 = elem.find('#matrix-total-excel')[0];
            var hot1, hot2;

            scope.rowsNumber = 100;
            scope.colsNumber = 100;

            scope.scrollPositions = {
                yearly: 0,
                total: 0
            };

            scope.generate = function () {

                hot1 = generateExcel($excelElem, scope.rowsNumber, scope.colsNumber)
                hot2 = generateExcel($excelElem2, scope.rowsNumber, 2)
            }

            Handsontable.Dom.addEvent(window, 'hashchange', function (event) {
                hot1.loadData(dataService.getData(scope.rowsNumber, scope.colsNumber)());
                hot2.loadData(dataService.getData(scope.rowsNumber, 2)());
            });


            function generateExcel(element, rows, cols) {
                var data = dataService.getData(rows, cols),
                    colHeaders = dataService.getHeaders(cols);
                

                function afterColHeader(col, th) {
                    var textContext = th.textContext;
                        if(col == 4) {
                        th.className += ' green';
                    }
                }

                function initCollums(){
                    var headers = [];
                    for (var i = 0; i < colHeaders.length; i++) {
                        var colName = colHeaders[i];
                            headers.push({
                                data: colName,
                                type: 'text',
                                renderer: colRenderer
                            });
                        }
                    return headers;
                };

                function colRenderer(instance, td, row, col, prop, value) {
                    Handsontable.renderers.TextRenderer.apply(this, arguments);

                    if(col == 4) {
                        td.className += ' green';
                    }
                }

                function scrollEvent() {
                    var yearly = $($excelElem).find('.ht_master  .wtHolder').scrollTop()
                    var total = $($excelElem2).find('.ht_master  .wtHolder').scrollTop();

                    if(yearly != scope.scrollPositions.yearly) {
                        scope.scrollPositions.yearly = yearly;
                        scope.scrollPositions.total = yearly;

                        $($excelElem2).find('.ht_master .wtHolder').scrollTop(yearly);
                        $($excelElem).find('.wtHolder').scroll();
                    } else if (total != scope.scrollPositions.total) {
                        scope.scrollPositions.yearly = total;
                        scope.scrollPositions.total = total;

                        $($excelElem).find('.ht_master .wtHolder').scrollTop(total);
                        $($excelElem2).find('.wtHolder').scroll();
                    }
                } 

                

                var hotSettings = {
                    data: dataService.getData(rows, cols)(),
                    
                    stretchH: 'all',
                    height: 800,
                    rendererAllRows: false,
                    fixedColumnsLeft: 1,
                    fixedRowsBottom: 4,
                    fixedRowsRight: 4,
                    contextMenu: true,
                    manualColumnFreeze: true,
                    colHeaders: dataService.getHeaders(cols),
                    afterGetColHeader: afterColHeader,
                    columns: initCollums(),
                    afterScrollVertically: scrollEvent
                };

                return new Handsontable( element, hotSettings);
            }
        }
    }
}