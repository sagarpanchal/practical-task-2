import React from 'react';
import { memoize } from 'lodash';

import { isEmpty, isNotEmpty } from 'utils';

import { COLUMNS } from 'datasets/columns';
import LIST from 'datasets/borrowers.json';
import Table from './Table';

const columnTypeMap = Object.fromEntries(COLUMNS.map((col) => [col?.name, col?.type]));
const opTypeMap = {
  String: ['Equals', 'Includes'],
  Number: ['Greater than', 'Less than'],
  Date: ['Greater than', 'Less than'],
};
const getDefaultFilter = () => ({
  column: COLUMNS?.[0]?.name,
  operator: opTypeMap?.[COLUMNS?.[0]?.type]?.[0],
  keyword: '',
});

function Filter() {
  const [filterList, setFilterList] = React.useState([getDefaultFilter()]);

  const setValue = React.useCallback((field, index) => {
    return (e) => {
      setFilterList((filterList) => {
        filterList[index][field] = e?.target?.value;

        filterList[index].operator = filterList[index]?.operator?.length
          ? filterList[index]?.operator
          : opTypeMap?.[columnTypeMap?.[filterList[index]?.column]]?.[0] ?? '';

        filterList[index] = { ...filterList[index] };
        return [...filterList];
      });
    };
  }, []);

  const addFilter = React.useCallback(() => {
    setFilterList((filterList) => [...filterList, getDefaultFilter()]);
  }, []);

  const removeFilter = React.useMemo(() => {
    return memoize(
      (index) => () => {
        setFilterList((filterList) => {
          filterList.splice(index, 1);
          return [...filterList];
        });
      },
      (...args) => JSON.stringify(args),
    );
  }, []);

  const usableFilters = React.useMemo(() => {
    return filterList.filter((_filter) => {
      return !Object.values(_filter).map(isNotEmpty).includes(true);
    });
  }, [filterList]);

  const filteredList = React.useMemo(() => {
    const output = LIST.filter((record) => {
      return usableFilters
        .map((_filter) => {
          const columnType = columnTypeMap?.[_filter?.column];

          const [value, keyword] = (() => {
            try {
              switch (columnType) {
                case 'String': {
                  return [String(record?.[_filter?.column]).toLowerCase(), String(_filter?.keyword).toLowerCase()];
                }
                case 'Date': {
                  return [new Date(record?.[_filter?.column]), new Date(_filter?.keyword)];
                }
                case 'Number': {
                  return [Number(record?.[_filter?.column]), Number(_filter?.keyword)];
                }

                default:
                  break;
              }
            } catch (error) {
              console.warn(error);
            }

            return [record?.[_filter?.column], _filter?.keyword];
          })();

          if (columnType === 'Date') {
            debugger;
          }

          switch (_filter?.operator) {
            case 'Equals': {
              return value === keyword;
            }

            case 'Includes': {
              return value?.indexOf(keyword) > -1;
            }

            case 'Greater than': {
              return value > keyword;
            }

            case 'Less than': {
              return value < keyword;
            }

            default:
              return value === keyword;
          }
        })
        .includes(true);
    });

    return usableFilters?.length > 0 ? output : LIST;
  }, [usableFilters]);

  return (
    <div>
      <div className="header">
        <h3>Filters</h3>
        <button onClick={addFilter}>Add Filter</button>
      </div>
      {filterList.map((filter, index) => {
        const { column, operator, keyword } = filter;

        const columnType = columnTypeMap?.[column];
        const opTypeList = opTypeMap?.[columnType] ?? [];

        return (
          <div key={`${index}-${column}-${operator}`}>
            <select type="text" name="column" value={column} onChange={setValue('column', index)}>
              {COLUMNS.map((col) => {
                return (
                  <option key={col?.name} value={col?.name}>
                    {col?.name}
                  </option>
                );
              })}
            </select>
            &nbsp;
            <select
              type="text"
              name="operator"
              value={operator}
              onChange={setValue('operator', index)}
              disabled={!opTypeList?.length}
            >
              {opTypeList?.map?.((op) => {
                return (
                  <option key={op} value={op}>
                    {op}
                  </option>
                );
              })}
            </select>
            &nbsp;
            <input type="text" name="keyword" value={keyword} onChange={setValue('keyword', index)} />
            <button onClick={removeFilter(index)}>X</button>
          </div>
        );
      })}
      <div className="table-wrapper">
        <Table list={filteredList} />
      </div>
    </div>
  );
}

Filter.propTypes = {};

export default Filter;
