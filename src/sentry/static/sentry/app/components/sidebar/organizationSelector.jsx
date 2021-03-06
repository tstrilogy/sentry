import PropTypes from 'prop-types';
import React from 'react';
import Link from '../link';
import SidebarPanel from '../sidebarPanel';
import LetterAvatar from '../letterAvatar';

import AppState from '../../mixins/appState';
import OrganizationStore from '../../stores/organizationStore';
import ConfigStore from '../../stores/configStore';

import {t} from '../../locale';

const OrganizationSelector = React.createClass({
  propTypes: {
    organization: PropTypes.object,
    showPanel: PropTypes.bool,
    togglePanel: PropTypes.func,
    hidePanel: PropTypes.func,
    currentPanel: PropTypes.string,
  },

  contextTypes: {
    location: PropTypes.object,
  },

  mixins: [AppState],

  getLinkNode(org, child, className) {
    let url = `/${org.slug}/`;
    if (!this.context.location) {
      return (
        <a className={className} href={url}>
          {child}
        </a>
      );
    }
    return (
      <Link className={className} to={`/${org.slug}/`}>
        {child}
      </Link>
    );
  },

  render() {
    let isSingleOrg = ConfigStore.get('singleOrganization');
    let activeOrg = this.props.organization;

    // Single-org accounts can't create new orgs/select between them
    if (isSingleOrg || !activeOrg) {
      return null;
    }

    let features = ConfigStore.get('features');

    let classNames = 'org-selector divider-bottom';
    if (this.props.currentPanel == 'org-selector') {
      classNames += ' active';
    }

    return (
      <div className={classNames}>
        <a className="active-org" onClick={this.props.togglePanel}>
          <LetterAvatar displayName={activeOrg.name} identifier={activeOrg.slug} />
        </a>

        {this.props.showPanel &&
          this.props.currentPanel == 'org-selector' && (
            <SidebarPanel title={t('Organizations')} hidePanel={this.props.hidePanel}>
              <ul className="org-list list-unstyled">
                {OrganizationStore.getAll().map(org => {
                  return (
                    <li
                      className={activeOrg.id === org.id ? 'org active' : 'org'}
                      key={org.slug}
                    >
                      {this.getLinkNode(
                        org,
                        <LetterAvatar displayName={org.name} identifier={org.slug} />,
                        'org-avatar'
                      )}
                      <h5>{this.getLinkNode(org, org.name)}</h5>
                      <p>
                        <a href={`/organizations/${org.slug}/settings/`}>
                          <span className="icon-settings" /> {t('Settings')}
                        </a>
                        <a href={`/organizations/${org.slug}/members/`}>
                          <span className="icon-users" /> {t('Members')}
                        </a>
                      </p>
                    </li>
                  );
                })}

                {features.has('organizations:create') && (
                  <li className="org-create">
                    <Link to="/organizations/new/" className="btn btn-default btn-block">
                      {t('New Organization')}
                    </Link>
                  </li>
                )}
              </ul>
            </SidebarPanel>
          )}
      </div>
    );
  },
});

export default OrganizationSelector;
