import { FC, KeyboardEvent, useEffect, useState } from 'react';
import { INavigatorSearchFilter, LocalizeText, SearchFilterOptions } from '../../../../api';
import { Flex } from '../../../../common';
import { useNavigator } from '../../../../hooks';

export interface NavigatorSearchViewProps
{
    sendSearch: (searchValue: string, contextCode: string) => void;
}

export const NavigatorSearchView: FC<NavigatorSearchViewProps> = props =>
{
    const { sendSearch = null } = props;
    const [ searchFilterIndex, setSearchFilterIndex ] = useState(0);
    const [ searchValue, setSearchValue ] = useState('');
    const { topLevelContext = null, searchResult = null } = useNavigator();

    const processSearch = () =>
    {
        if(!topLevelContext) return;

        let searchFilter = SearchFilterOptions[searchFilterIndex];

        if(!searchFilter) searchFilter = SearchFilterOptions[0];

        const searchQuery = ((searchFilter.query ? (searchFilter.query + ':') : '') + searchValue);

        sendSearch((searchQuery || ''), topLevelContext.code);
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== 'Enter') return;

        processSearch();
    };

    useEffect(() =>
    {
        if(!searchResult) return;

        const split = searchResult.data.split(':');

        let filter: INavigatorSearchFilter = null;
        let value: string = '';

        if(split.length >= 2)
        {
            const [ query, ...rest ] = split;

            filter = SearchFilterOptions.find(option => (option.query === query));
            value = rest.join(':');
        }
        else
        {
            value = searchResult.data;
        }

        if(!filter) filter = SearchFilterOptions[0];

        setSearchFilterIndex(SearchFilterOptions.findIndex(option => (option === filter)));
        setSearchValue(value);
    }, [ searchResult ]);

    return (
        <Flex fullWidth gap={ 1 } className="mb-2">
            <Flex shrink>
                <select className="form-select form-select-sm" value={ searchFilterIndex } onChange={ event => setSearchFilterIndex(parseInt(event.target.value)) }>
                    { SearchFilterOptions.map((filter, index) =>
                    {
                        return <option key={ index } value={ index }>{ LocalizeText('navigator.filter.' + filter.name) }</option>
                    }) }
                </select>
            </Flex>
            <Flex fullWidth gap={ 2 }>
                <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('navigator.filter.input.placeholder') } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } onKeyDown={ event => handleKeyDown(event) } />
                <i className="icon icon-pen navigator-search-button position-absolute" onClick={ processSearch } />
            </Flex>
        </Flex>
    );
}
