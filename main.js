const filterContainer = document.getElementsByClassName('catalog__sidebar')[0];
if(filterContainer) {
    console.log('Adding release date filter...');
    var releaseDateFilterContainer = document.createElement('div');
    releaseDateFilterContainer.setAttribute('id', 'release-date-filter');
    filterContainer.prepend(releaseDateFilterContainer);

    var Filter = function(options) {
        this.options = options;
        this.elem = document.querySelector(options.selector);
        this.data = options.data;
        this.template = options.template;
        this.realState = {
            active_filters: ''
        };

        var stateHandler = {
            get: function(obj, prop) {
                console.log('get state');

                if(prop == 'active_filters') {
                    var searchParams = new URLSearchParams(window.location.search);
                    var releaseQueryParam = searchParams.get('release');
                    console.log('release', releaseQueryParam);
                    if(!obj[prop] && releaseQueryParam) {
                        obj[prop] = releaseQueryParam;
                    }
                }

                return obj[prop];
            },
            set: function(obj, prop, value) {
                console.log('set state');
                obj[prop] = value;
    
                if(prop == 'active_filters') {
                    var searchParams = new URLSearchParams(window.location.search);
                    searchParams.set('release', value);
                    window.location.search = searchParams.toString();
                    // var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
                    // history.pushState(null, '', newRelativePathQuery);
                }
    
                return true;
            }
        };
        this.state = new Proxy(this.realState, stateHandler);
    };

    Filter.prototype.render = function() {
        const that = this;
        this.elem.innerHTML = this.template(this.data);
        document.addEventListener('click', function(event) {
            if(event.target.matches(that.options.selector + ' ul li')) {
                console.log(event.target.dataset.id);
                const removeItemPattern = new RegExp(`,?${event.target.dataset.id},?`, 'gi');
                const trimDelimitersPattern = new RegExp('^,|,$', 'g');
                var updatedActiveFilters = '';
                if(that.state.active_filters.includes(event.target.dataset.id)) {
                    // make inactive
                    updatedActiveFilters = that.state.active_filters.replace(removeItemPattern, ',').replace(trimDelimitersPattern, '');
                } else {
                    // make active
                    updatedActiveFilters = that.state.active_filters.concat(`,${event.target.dataset.id}`).replace(trimDelimitersPattern, '');
                }
                Object.assign(that.state, {
                    active_filters: updatedActiveFilters
                });

                console.log('state', that.state);

                const el = event.target;
                console.log(el);
            }
        });
    };

    var releaseDateFilter = new Filter({
        selector: '#release-date-filter',
        data: {
            title: 'Release Date',
            query_var: 'release',
            values: [
                {
                    label: 'Before 2000',
                    id: 'p2000'
                },
                {
                    label: '2000 - 2004',
                    id: '2000_2004'
                },
                {
                    label: '2005 - 2009',
                    id: '2005_2009'
                },
                {
                    label: '2010 - 2014',
                    id: '2010_2014'
                },
                {
                    label: 'After 2000',
                    id: 'a2015'
                }
            ]
        },
        template: function(props) {
            const that = this;
            return `
                <div>
                    <h5>${props.title}</h5>
                    <ul>
                        ${props.values.map(function(value) {
                            return `<li ${that.state.active_filters.includes(value.id) ? 'class="active"' : ''}' data-id='${value.id}'>${value.label}</li>`
                        }).join('')}
                    </ul>
                </div>
            `;
        }
    });

    releaseDateFilter.render();
}