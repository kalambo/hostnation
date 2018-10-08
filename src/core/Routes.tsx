import * as React from 'react';
import { Div, Txt } from 'elmnt';
import { decodeId } from 'common';
import { Spinner } from 'common-client';
import r from 'refluent';
import { Redirect } from 'react-router-dom';

import DashboardForm from './DashboardForm';
import { Route } from './router';
import styles, { colors } from './styles';
import TableLinks from './tableLinks';

export const LinksRoute = ({ path, title, columns, rows }) => (
  <Route
    path={path}
    exact
    label={title}
    render={() => (
      <Div style={{ spacing: 40 }}>
        <Txt style={{ ...styles.header, fontSize: 50 }}>{title}</Txt>
        <TableLinks
          path={path}
          columns={columns}
          rows={rows}
          style={styles.tableLinks}
        />
      </Div>
    )}
  />
);

const DeleteButton = r
  .do('dataKey', (dataKey, push) => ({
    deleted: false,
    onClick: () => {
      if (
        window.confirm(
          'This action is permanent - are you sure you want to delete this record?',
        )
      ) {
        push({ deleted: true });
        window.rgo.set({ key: dataKey, value: null });
        window.rgo.commit(dataKey);
      }
    },
  }))
  .yield(
    ({ deleted, onClick }) =>
      deleted ? (
        <Redirect
          to={window.location.pathname.substring(
            0,
            window.location.pathname.lastIndexOf('/'),
          )}
        />
      ) : (
        <Txt
          onClick={onClick}
          style={{
            ...styles.subtitle,
            color: 'white',
            background: 'red',
            padding: 10,
            width: 300,
            cursor: 'pointer',
          }}
        >
          DELETE RECORD
        </Txt>
      ),
  );

export const FormsRoute = ({ path, type, title, forms }) => (
  <Route
    path={`${path}/:id`}
    label={({ id }) => [
      {
        name: type,
        filter: decodeId(id),
        fields: ['id', ...title[0]],
      },
      data => title[1](data[type][0]),
    ]}
    loader={<Spinner style={{ color: colors.purple, paddingTop: 300 }} />}
    render={({ data }) => (
      <Div style={{ spacing: 40 }}>
        <Txt style={{ ...styles.header, fontSize: 50 }}>
          {title[1](data[type][0])}
        </Txt>
        {forms.map(({ title, object, blocks }, i) => (
          <Div style={{ spacing: 15 }} key={i}>
            <Txt style={styles.header}>{title}</Txt>
            <DashboardForm
              objects={{ [object]: { type, id: data[type][0].id } }}
              blocks={blocks}
            />
          </Div>
        ))}
        <DeleteButton dataKey={[type, data[type][0].id]} />
      </Div>
    )}
  />
);
