;(function () {
  'use strict'

  var ngModule = angular.module('eha.login-dialog', [
    'eha.login-dialog.service',
    'eha.login-dialog.controller',
    'eha.login-dialog.run',
    'eha.login-dialog.config'
  ])

  // Check for and export to commonjs environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ngModule
  }
})()

;(function () {
  'use strict'
  /**
   * @ngdoc config
   * @name ehaLoginDialog
   * @module eha.login-dialog
   */
  var ngModule = angular.module('eha.login-dialog.config', [
    'pouchdb'
  ])

  ngModule.config(['pouchDBProvider', 'POUCHDB_METHODS', function (pouchDBProvider, POUCHDB_METHODS) {
    POUCHDB_METHODS.login = 'qify'
  }])
  // Check for and export to commonjs environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ngModule
  }
})()

;(function () {
  'use strict'
  /**
   * @ngdoc controller
   * @name ehaCounter
   * @module eha.login-dialog
   */
  var ngModule = angular.module('eha.login-dialog.controller', [])

  ngModule.controller('EhaLoginDialogController', ['$scope', '$modalInstance', 'modalParams', 'ehaLoginService', function (
    $scope,
    $modalInstance,
    modalParams,
    ehaLoginService
  ) {
    $scope.headerMessage = !angular.isArray(modalParams.title) ? modalParams.title : ''
    $scope.headerMessage2 = modalParams.title
    $scope.bodyMessage = modalParams.bodyText
    $scope.confirmBtnMsg = modalParams.buttonLabels.YES
    $scope.cancelBtnMsg = modalParams.buttonLabels.NO
    $scope.confirm = $modalInstance.close
    $scope.cancel = $modalInstance.dismiss
    $scope.wrongPasskey = false
    $scope.dismissMessage = 'Cancel confirm dialog'
    $scope.online = true

    $scope.authenticate = function (username, passkey) {
      $scope.wrongPasskey = false
      $scope.isAuthenticating = true
      $scope.cannotReachServer = false

      if (!username || !passkey) {
        $scope.wrongPasskey = true
        $scope.isAuthenticating = false
        return
      }

      return ehaLoginService.login(username, passkey)
        .then($modalInstance.close)
        .catch(function (err) {
          // TODO: allow to dismiss / cancel if user wants to keep
          //       using the app

          // pw is wrong, update form with error, ask to enter again
          if (err.status === 401) {
            $scope.wrongPasskey = true
          // Server is unreachable/phone is offline
          } else {
            $scope.cannotReachServer = true
          }

          console.log('error', err)
        })
        .finally(function () {
          $scope.isAuthenticating = false
        })
    }

    console.log($scope.cannotReachServer)

    $scope.cancel = function () {
      $modalInstance.dismiss('cancelled')
    }
  }])

  // Check for and export to commonjs environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ngModule
  }
})()

;(function () {
  'use strict'
  /**
   * @ngdoc run
   * @name ehaLoginDialog
   * @module eha.login-dialog
   */
  var ngModule = angular.module('eha.login-dialog.run', [
    'eha.login-service',
    'eha.login-dialog.service'
  ])

  ngModule.run(['ehaLoginService', 'ehaLoginDialogService', function (ehaLoginService, ehaLoginDialogService) {
    ehaLoginService.config(ehaLoginDialogService)
  }])

  // Check for and export to commonjs environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ngModule
  }
})()

;(function () {
  'use strict'
  /**
   * @ngdoc service
   * @name ehaCounter
   * @module eha.login-dialog
   */
  var ngModule = angular.module('eha.login-dialog.service', [
    'gettext',
    'ui.bootstrap.modal',
    'template/modal/backdrop.html',
    'template/modal/window.html'
  ])

  ngModule.service('ehaLoginDialogService', ['$q', '$log', '$modal', 'gettextCatalog', function (
    $q,
    $log,
    $modal,
    gettextCatalog
  ) {
    /*
     * The loginDialogService caches the modal that is currently shown
     * to be able to call multiple retriables, while not showing more
     * than one modal
     */
    var dialog
    return function loginDialog () {
      if (dialog) {
        return dialog
      }

      var buttonLabels = [
        gettextCatalog.getString('yes'),
        gettextCatalog.getString('no')
      ]

      var confirmDialog = $modal.open({
        templateUrl: 'templates/login-dialog.template.tpl.html',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          modalParams: ['$q', function ($q) {
            return $q.when({
              buttonLabels: {
                YES: buttonLabels[0],
                NO: buttonLabels[1]
              }
            })
          }]
        },
        controller: 'EhaLoginDialogController'
      })

      dialog = confirmDialog.result
      confirmDialog.result.finally(function () {
        dialog = null
      })

      return confirmDialog.result
    }
  }])

  // Check for and export to commonjs environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ngModule
  }
})()
