import React from 'react';
import PropTypes from 'prop-types';

function Table(props) {
  const { list } = props;

  const fields = React.useMemo(() => Object.keys(list?.[0] ?? {}), [list]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            {fields?.map?.((field) => (
              <th key={field}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list?.map((record) => {
            return (
              <tr key={record?.id}>
                {fields.map((field) => (
                  <td key={`${record?.id}-${field}`}>{record?.[field]}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  list: PropTypes.array,
};

export default Table;
