const filterContainer = document.getElementsByClassName('catalog__sidebar')[0];
if(filterContainer) {
    console.log('Adding release date filter...');
    var releaseFilterContainer = document.createElement('div');
    releaseFilterContainer.setAttribute('id', 'release-filter');
    filterContainer.prepend(releaseFilterContainer);

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
                if(prop == 'active_filters') {
                    var searchParams = new URLSearchParams(window.location.search);
                    var releaseQueryParam = searchParams.get('release');
                    if(!obj[prop] && releaseQueryParam) {
                        obj[prop] = releaseQueryParam;
                    }
                }

                return obj[prop];
            },
            set: function(obj, prop, value) {
                obj[prop] = value;
    
                if(prop == 'active_filters' && value !== '') {
                    var searchParams = new URLSearchParams(window.location.search);
                    searchParams.set('release', value);
                    window.location.search = searchParams.toString().replace('%2C', ',');
                    // var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
                    // history.pushState(null, '', newRelativePathQuery);
                }
                releaseFilter.render();

                return true;
            }
        };
        this.state = new Proxy(this.realState, stateHandler);
    };

    Filter.prototype.init = function() {
        var that = this;
        document.addEventListener('click', function(event) {
            if(event.target.matches(that.options.selector + ' ul li')) {
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

                const el = event.target;
            } else if(event.target.matches('.filter__clear-wrapper') && event.target.getAttribute('ng-click').includes('release')) {
                Object.assign(that.state, {
                    active_filters: ''
                })
            }
        });
    };

    Filter.prototype.render = function() {
        this.elem.innerHTML = this.template(this.data);
    };

    var releaseFilter = new Filter({
        selector: '#release-filter',
        data: {
            title: 'Release',
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
                <div ${that.state.active_filters ? 'class="active"' : ''}>
                    <h5>${props.title}</h5>
                    <ul>
                        ${props.values.map(function(value) {
                            return `<li ${that.state.active_filters.includes(value.id) ? 'class="active"' : ''} data-id='${value.id}'>${value.label}</li>`
                        }).join('')}
                    </ul>
                </div>
            `;
        }
    });

    releaseFilter.init();
    releaseFilter.render();
}