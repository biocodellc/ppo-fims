(function () {
    'use strict';

    angular.module('fims.query')
        .controller('QueryFormController', QueryFormController);

    QueryFormController.$inject = ['queryParams', 'queryService', 'queryResults', 'queryMap',
        'usSpinnerService', 'exception'];

    function QueryFormController(queryParams, queryService, queryResults, queryMap, usSpinnerService, exception) {
        var SOURCE = ["latitude", "longitude", "startDayOfYear", "year", "genus", "specificEpithet", "source"];

        var vm = this;

        // select lists
        vm.traits = {
          'plant phenological trait': 'http://purl.obolibrary.org/obo/PPO_0002000',
          'plant structure presence': 'http://purl.obolibrary.org/obo/PPO_0002001',
          'abscised plant structure presence': 'http://purl.obolibrary.org/obo/PPO_0002002',
          'new shoot system presence': 'http://purl.obolibrary.org/obo/PPO_0002003',
          'new above-ground shoot-borne shoot system presence': 'http://purl.obolibrary.org/obo/PPO_0002004',
          'new shoot system emerging from ground presence': 'http://purl.obolibrary.org/obo/PPO_0002005',
          'new shoot system emerging from ground in first growth cycle presence': 'http://purl.obolibrary.org/obo/PPO_0002006',
          'seedling presence': 'http://purl.obolibrary.org/obo/PPO_0002007',
          'new shoot system emerging from ground in later growth cycle presence': 'http://purl.obolibrary.org/obo/PPO_0002008',
          'leaf bud presence': 'http://purl.obolibrary.org/obo/PPO_0002009',
          'dormant leaf bud presence': 'http://purl.obolibrary.org/obo/PPO_0002010',
          'non-dormant leaf bud presence': 'http://purl.obolibrary.org/obo/PPO_0002011',
          'swelling leaf bud presence': 'http://purl.obolibrary.org/obo/PPO_0002012',
          'breaking leaf bud presence': 'http://purl.obolibrary.org/obo/PPO_0002013',
          'vascular leaf presence': 'http://purl.obolibrary.org/obo/PPO_0002014',
          'true leaf presence': 'http://purl.obolibrary.org/obo/PPO_0002015',
          'unfolding true leaf presence': 'http://purl.obolibrary.org/obo/PPO_0002016',
          'unfolded true leaf presence': 'http://purl.obolibrary.org/obo/PPO_0002017',
          'non-senescing unfolded true leaf presence': 'http://purl.obolibrary.org/obo/PPO_0002018',
          'senescing true leaf presence': 'http://purl.obolibrary.org/obo/PPO_0002019',
          'immature unfolded true leaf presence': 'http://purl.obolibrary.org/obo/PPO_0002020',
          'mature true leaf presence': 'http://purl.obolibrary.org/obo/PPO_0002021',
          'expanding unfolded true leaf presence': 'http://purl.obolibrary.org/obo/PPO_0002022',
          'expanded immature true leaf presence': 'http://purl.obolibrary.org/obo/PPO_0002023',
          'expanding true leaf presence': 'http://purl.obolibrary.org/obo/PPO_0002024',
          'reproductive structure presence': 'http://purl.obolibrary.org/obo/PPO_0002025',
          'floral structure presence': 'http://purl.obolibrary.org/obo/PPO_0002026',
          'non-senesced floral structure presence': 'http://purl.obolibrary.org/obo/PPO_0002027',
          'unopened floral structure presence': 'http://purl.obolibrary.org/obo/PPO_0002028',
          'opening floral structure presence': 'http://purl.obolibrary.org/obo/PPO_0002029',
          'opened floral structure presence': 'http://purl.obolibrary.org/obo/PPO_0002030',
          'pollen-releasing floral structure presence': 'http://purl.obolibrary.org/obo/PPO_0002031',
          'senesced floral structure presence': 'http://purl.obolibrary.org/obo/PPO_0002032',
          'flower presence': 'http://purl.obolibrary.org/obo/PPO_0002033',
          'non-senesced flower presence': 'http://purl.obolibrary.org/obo/PPO_0002034',
          'unopened flower presence': 'http://purl.obolibrary.org/obo/PPO_0002035',
          'opening flower presence': 'http://purl.obolibrary.org/obo/PPO_0002036',
          'opened flower presence': 'http://purl.obolibrary.org/obo/PPO_0002037',
          'pollen-releasing flower presence': 'http://purl.obolibrary.org/obo/PPO_0002038',
          'senesced flower presence': 'http://purl.obolibrary.org/obo/PPO_0002039',
          'flower head presence': 'http://purl.obolibrary.org/obo/PPO_0002040',
          'non-senesced flower head presence': 'http://purl.obolibrary.org/obo/PPO_0002041',
          'unopened flower head presence': 'http://purl.obolibrary.org/obo/PPO_0002042',
          'opening flower head presence': 'http://purl.obolibrary.org/obo/PPO_0002043',
          'opened flower head presence': 'http://purl.obolibrary.org/obo/PPO_0002044',
          'pollen-releasing flower head presence': 'http://purl.obolibrary.org/obo/PPO_0002045',
          'senesced flower head presence': 'http://purl.obolibrary.org/obo/PPO_0002046',
          'fruit presence': 'http://purl.obolibrary.org/obo/PPO_0002047',
          'ripening fruit presence': 'http://purl.obolibrary.org/obo/PPO_0002048',
          'unripe fruit presence': 'http://purl.obolibrary.org/obo/PPO_0002049',
          'ripe fruit presence': 'http://purl.obolibrary.org/obo/PPO_0002050',
          'cone presence': 'http://purl.obolibrary.org/obo/PPO_0002051',
          'pollen cone presence': 'http://purl.obolibrary.org/obo/PPO_0002052',
          'fresh pollen cone presence': 'http://purl.obolibrary.org/obo/PPO_0002053',
          'open pollen cone presence': 'http://purl.obolibrary.org/obo/PPO_0002054',
          'pollen-releasing pollen cone presence': 'http://purl.obolibrary.org/obo/PPO_0002055',
          'seed cone presence': 'http://purl.obolibrary.org/obo/PPO_0002056',
          'fresh seed cone presence': 'http://purl.obolibrary.org/obo/PPO_0002057',
          'ripening seed cone presence': 'http://purl.obolibrary.org/obo/PPO_0002058',
          'unripe seed cone presence': 'http://purl.obolibrary.org/obo/PPO_0002059',
          'ripe seed cone presence': 'http://purl.obolibrary.org/obo/PPO_0002060',
          'abscised leaf presence': 'http://purl.obolibrary.org/obo/PPO_0002061',
          'abscised fruit or seed presence': 'http://purl.obolibrary.org/obo/PPO_0002062',
          'abscised cone or seed presence': 'http://purl.obolibrary.org/obo/PPO_0002063'
        }

        vm.dataSources = [
          'NPN',
          'PEP725',
          'NEON',
          'ASU'
        ];

        // view toggles
        vm.showMap = true;

        vm.params = queryParams;

        vm.queryJson = queryJson;

        function queryJson() {
            usSpinnerService.spin('query-spinner');

            queryService.queryJson(queryParams.build(), 0, 10000, SOURCE)
                .then(queryJsonSuccess)
                .catch(queryJsonFailed)
                .finally(queryJsonFinally);

            function queryJsonSuccess(data) {
                queryResults.update(data);
                queryMap.setMarkers(queryResults.data);
            }

            function queryJsonFailed(response) {
                exception.catcher("Failed to load query results")(response);
                vm.queryResults.isSet = false;
            }

            function queryJsonFinally() {
                usSpinnerService.stop('query-spinner');
            }

        }
    }
})();