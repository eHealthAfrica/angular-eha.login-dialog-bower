angular.module('eha.login-dialog.template', ['templates/login-dialog.template.tpl.html']);

angular.module("templates/login-dialog.template.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/login-dialog.template.tpl.html",
    "<div class=\"modal-header alert-info\">\n" +
    "  <i class=\"fa fa-lock\"></i>\n" +
    "  <span translate>Authentication</span>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "  <form\n" +
    "    role=\"form\"\n" +
    "    name=\"login-form\"\n" +
    "    ng-submit=\"authenticate(username, passkey)\"\n" +
    "  >\n" +
    "    <div class=\"col-md-15\">\n" +
    "      <div class=\"alert alert-danger\" role=\"alert\" ng-if=\"wrongPasskey === true\">\n" +
    "        <span translate>Wrong password. If you are sure you entered the correct password, contact support.</span>\n" +
    "      </div>\n" +
    "      <div class=\"alert alert-warning\" role=\"alert\" ng-if=\"cannotReachServer === true || !online\">\n" +
    "        <h4 translate>Offline</h4>\n" +
    "        <p translate>You seem to be offline, so we could not check your password. Please check your connection and try again.</p>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label translate>Username</label>\n" +
    "        <input\n" +
    "          autofocus\n" +
    "          type=\"text\"\n" +
    "          class=\"form-control\"\n" +
    "          placeholder=\"\"\n" +
    "          ng-model=\"username\"\n" +
    "          ng-disabled=\"!online\"\n" +
    "          tab-to-next-input-on-enter\n" +
    "          autocomplete=\"off\"\n" +
    "          autocorrect=\"off\"\n" +
    "          autocapitalize=\"off\"\n" +
    "          spellcheck=\"false\"\n" +
    "        >\n" +
    "        <label translate>Password</label>\n" +
    "        <input\n" +
    "          type=\"password\"\n" +
    "          class=\"form-control\"\n" +
    "          placeholder=\"\"\n" +
    "          ng-model=\"passkey\"\n" +
    "          ng-disabled=\"!online\"\n" +
    "          autocomplete=\"off\"\n" +
    "          autocorrect=\"off\"\n" +
    "          autocapitalize=\"off\"\n" +
    "          spellcheck=\"false\"\n" +
    "        >\n" +
    "      </div>\n" +
    "      <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"!online\">\n" +
    "        <i\n" +
    "          class=\"fa\"\n" +
    "          ng-class=\"isAuthenticating && 'fa-spinner fa-spin' || 'fa-chevron-circle-right'\"\n" +
    "        ></i>\n" +
    "        <span translate>Login</span>\n" +
    "      </button>\n" +
    "      <button type=\"submit\" class=\"btn btn-default\" ng-click=\"cancel()\">\n" +
    "        <span translate>Cancel</span>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "");
}]);

;(function () {
  'use strict'

  var ngModule = angular.module('eha.login-dialog', [
    'eha.login-dialog.service',
    'eha.login-dialog.template',
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
