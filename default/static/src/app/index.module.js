/* global malarkey:false, toastr:false, moment:false */
import config from './index.config';

import routerConfig from './index.route';

import runBlock from './index.run';
import MainController from './main/main.controller';
import GithubContributorService from '../app/components/githubContributor/githubContributor.service';
import WebDevTecService from '../app/components/webDevTec/webDevTec.service';
import NavbarDirective from '../app/components/navbar/navbar.directive';
import MalarkeyDirective from '../app/components/malarkey/malarkey.directive';
import EqualizerDaphne1 from '../app/components/visualization/visualizations/EqualizerDaphne1/EqualizerDaphne1.directive';
import EqualizerJeremy1 from '../app/components/visualization/visualizations/EqualizerJeremy1/EqualizerJeremy1.directive';
import VisualizationDirective from '../app/components/visualization/visualization.directive';

angular.module('audioFun', ['ngAnimate', 'ngCookies', 'ngSanitize', 'ngResource', 'ui.router'])
  .constant('malarkey', malarkey)
  .constant('toastr', toastr)
  .constant('moment', moment)
  .config(config)

  .config(routerConfig)

  .run(runBlock)
  .service('githubContributor', GithubContributorService)
  .service('webDevTec', WebDevTecService)
  .controller('MainController', MainController)
  .directive('acmeNavbar', () => new NavbarDirective())
  .directive('acmeMalarkey', () => new MalarkeyDirective(malarkey))
  .directive('equalizerDaphne1', () => new EqualizerDaphne1('equalizer-daphne1'))
  .directive('equalizerJeremy1', () => new EqualizerJeremy1('equalizer-jeremy1'))
  .directive('visualization', () => new VisualizationDirective());
