/*
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2015 Canonical Ltd.

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License version 3, as published by
the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranties of MERCHANTABILITY,
SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero
General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

YUI.add('deployment-summary', function() {

  juju.components.DeploymentSummary = React.createClass({

    propTypes: {
      autoPlaceUnits: React.PropTypes.func.isRequired,
      changeDescriptions: React.PropTypes.array.isRequired,
      changeState: React.PropTypes.func.isRequired,
      ecsClear: React.PropTypes.func.isRequired,
      ecsCommit: React.PropTypes.func.isRequired,
      getUnplacedUnitCount: React.PropTypes.func.isRequired
    },

    /**
      Close the summary.

      @method _close
    */
    _close: function() {
      this.props.changeState({
        sectionC: {
          component: null,
          metadata: {}
        }
      });
    },

    /**
      Handles calling to clear the ecs and then closing the deployment
      summary.

      @method _handleClear
    */
    _handleClear: function() {
      this.props.ecsClear();
      this._close();
    },

    /**
      Navigate to the choose cloud step.

      @method _handleChangeCloud
    */
    _handleChangeCloud: function() {
      this.props.changeState({
        sectionC: {
          component: 'deploy',
          metadata: {
            activeComponent: 'choose-cloud'
          }
        }
      });
    },

    /**
      Handle committing when the deploy button in the summary is clicked.

      @method _handleDeploy
    */
    _handleDeploy: function() {
      this.props.autoPlaceUnits();
      // The env is already bound to ecsCommit in app.js.
      this.props.ecsCommit();
      this.setState({hasCommits: true}, () => {
        this._close();
      });
    },

    /**
      Handle navigating to the machine view.

      @method _handleViewMachinesClick
    */
    _handleViewMachinesClick: function() {
      this.props.changeState({
        sectionB: {
          component: 'machine',
          metadata: {}
        },
        sectionC: {
          component: null,
          metadata: {}
        }
      });
    },

    /**
      Generate the list of change items.

      @method _generateChangeItems
      @returns {Array} The collection of changes.
    */
    _generateChangeItems: function() {
      var changeList = this.props.changeDescriptions;
      var changes = [];
      changeList.forEach(function(change, i) {
        changes.push(
          <juju.components.DeploymentSummaryChangeItem
            key={i}
            change={change} />
          );
      }, this);
      return changes;
    },

    /**
      Generate a message if there are unplaced units.

      @method _generatePlacement
      @returns {Object} The placement markup.
    */
    _generatePlacement: function() {
      var unplacedCount = this.props.getUnplacedUnitCount();
      if (unplacedCount === 0) {
        return;
      }
      var plural = unplacedCount === 1 ? '' : 's';
      return (
        <div className="deployment-summary__placement">
          <span>
            You have {unplacedCount.toString()} unplaced unit{plural} which will
            be automatically placed.
          </span>
          <span className="link" tabIndex="0" role="button"
            onClick={this._handleViewMachinesClick}>
            View machines
          </span>
        </div>);
    },

    render: function() {
      var listHeaderClassName = 'deployment-summary-change-item ' +
          'deployment-summary__list-header';
      var buttons = [{
        action: this._handleChangeCloud,
        title: 'Change cloud',
        type: 'inline-neutral'
      }, {
        title: 'Deploy',
        action: this._handleDeploy,
        type: 'inline-positive'
      }];
      return (
        <div className="deployment-panel__child">
          <juju.components.DeploymentPanelContent
            title="Deployment summary">
            {this._generatePlacement()}
            <ul className="deployment-summary__list">
              <li className={listHeaderClassName}>
                <span className="deployment-summary-change-item__change">
                  Change
                </span>
                <span className="deployment-summary-change-item__time">
                  Time
                </span>
              </li>
              {this._generateChangeItems()}
            </ul>
          </juju.components.DeploymentPanelContent>
          <juju.components.DeploymentPanelFooter
            buttons={buttons} />
        </div>
      );
    }
  });

}, '0.1.0', { requires: [
  'deployment-panel-content',
  'deployment-panel-footer',
  'deployment-summary-change-item'
]});