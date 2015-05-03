   Ext.override(Ext.data.NodeInterface, {
            statics: {
                getPrototypeBody: function() {
                    var result = this.callParent();

                    result.filter = function(property, value, anyMatch, caseSensitive, matchParentNodes) {
                        var filters = [];

                        //support for the simple case of filtering by property/value
                        if (Ext.isString(property)) {
                            filters.push(new Ext.util.Filter({
                                property: property,
                                value: value,
                                anyMatch: anyMatch,
                                caseSensitive: caseSensitive
                            }));
                        } else if (Ext.isArray(property) || property instanceof Ext.util.Filter) {
                            filters = filters.concat(property);
                        }

                        // At this point we have an array of zero or more Ext.util.Filter objects to filter with,
                        // so here we construct a function that combines these filters by ANDing them together
                        // and filter by that.
                        return this.filterBy(Ext.util.Filter.createFilterFn(filters), null, matchParentNodes);
                    };

                    result.filterBy = function(fn, scope, matchParentNodes) {
                        var me = this,
                            newNode = me.copy(null, true),
                            matchedNodes = [],
                            allNodes = [],
                            markMatch, i;

                        markMatch = function(node) {
                            node.filterMatch = true;
                            if (node.parentNode) {
                                markMatch(node.parentNode);
                            }
                        };

                        newNode.cascadeBy(function(node) {
                            allNodes.push(node);
                            if (fn.call(scope || me, node)) {
                                if (node.isLeaf() || matchParentNodes === true) {
                                    matchedNodes.push(node);
                                }
                            }
                        });

                        for (i = 0; i < matchedNodes.length; i++) {
                            markMatch(matchedNodes[i])
                        };

                        for (i = 0; i < allNodes.length; i++) {
                            if (allNodes[i].filterMatch !== true) {
                                allNodes[i].remove();
                            }
                        };

                        return newNode;
                    }

                    return result;
                }
            }
        });

        Ext.define('Ext.override.data.TreeStore', {
            override: 'Ext.data.TreeStore'

            ,
            hasFilterListeners: false,
            filterListeners: {
                move: function(node, oldParent, newParent, index) {
                    var me = this,
                        snapshotNode = me.snapshot.findChild('id', node.get('id'), true),
                        snapshotNewParent = me.snapshot.findChild('id', newParent.get('id'), true) || me.snapshot;
                    console.log('move listener here');
                    snapshotNewParent.insertChild(index, snapshotNode);
                },
                append: function(parentNode, appendedNode, index) {
                    var me = this,
                        snapshotParentNode = me.snapshot.findChild('id', parentNode.get('id'), true) || me.shapshot,
                        foundNode = me.snapshot.findChild('id', appendedNode.get('id'), true);
                    console.log('append listener here');
                    snapshotParentNode.insertChild(index, foundNode || appendedNode.copy(null, true));
                },
                insert: function(parentNode, insertedNode, refNode) {
                    var me = this,
                        snapshotParentNode = me.snapshot.findChild('id', parentNode.get('id'), true) || me.snapshot,
                        foundNode = me.snapshot.findChild('id', insertedNode.get('id'), true);

                    console.log('insert listener here');
                    snapshotParentNode.insertBefore(foundNode || insertedNode.copy(null, true), refNode);
                },
                remove: function(parentNode, removedNode, isMove) {
                    var me = this;
                    console.log('remove')
                    if (!isMove) {
                        console.log('actually responding to remove');
                        me.snapshot.findChild('id', removedNode.get('id'), true).remove(true);
                    }
                }
            }

            ,
            filter: function(filters, value, anyMatch, caseSensitive, matchParentNodes) {
                if (Ext.isString(filters)) {
                    filters = {
                        property: filters,
                        value: value,
                        root: 'data',
                        anyMatch: anyMatch,
                        caseSensitive: caseSensitive
                    };
                }

                var me = this,
                    decoded = me.decodeFilters(filters),
                    i,
                    doLocalSort = me.sorters.length && me.sortOnFilter && !me.remoteSort,
                    length = decoded.length,
                    filtered;

                for (i = 0; i < length; i++) {
                    me.filters.replace(decoded[i]);
                }

                if (me.remoteFilter) {
                    // So that prefetchPage does not consider the store to be fully loaded if the local count is equal to the total count
                    delete me.totalCount;

                    // Reset to the first page, the filter is likely to produce a smaller data set
                    me.currentPage = 1;
                    //the load function will pick up the new filters and request the filtered data from the proxy
                    me.load();
                } else {
                    if (me.filters.getCount()) {
                        me.snapshot = me.snapshot || me.getRootNode().copy(null, true);

                        // Filter the unfiltered dataset using the filter set
                        filtered = me.setRootNode(me.snapshot.filter(me.filters.items, null, null, null, matchParentNodes));
                        filtered.getOwnerTree().expandAll();

                        me.addFilterListeners();

                        if (doLocalSort) {
                            me.sort();
                        } else {
                            // fire datachanged event if it hasn't already been fired by doSort
                            me.fireEvent('datachanged', me);
                            me.fireEvent('refresh', me);
                        }
                    }
                }
                me.fireEvent('filterchange', me, me.filters.items);
            }

            ,
            addFilterListeners: function() {
                var me = this;

                if (!me.hasFilterListeners) {
                    me.on(me.filterListeners);
                    me.hasFilterListeners = true;
                }
            }

            ,
            filterBy: function(fn, scope, matchParentNodes) {
                var me = this;

                me.snapshot = me.snapshot || me.getRootNode().copy(null, true);
                me.setRootNode(me.queryBy(fn, scope || me, matchParentNodes));

                me.addFilterListeners();

                me.fireEvent('datachanged', me);
                me.fireEvent('refresh', me);
            }

            ,
            queryBy: function(fn, scope, matchParentNodes) {
                var me = this;
                return (me.snapshot || me.getRootNode()).filterBy(fn, scope || me, matchParentNodes);
            }

            ,
            clearFilter: function(suppressEvent) {
                var me = this;

                me.filters.clear();

                if (me.hasFilterListeners) {
                    me.un(me.filterListeners);
                    me.hasFilterListeners = false;
                }

                if (me.remoteFilter) {

                    // In a buffered Store, the meaning of suppressEvent is to simply clear the filters collection
                    if (suppressEvent) {
                        return;
                    }

                    // So that prefetchPage does not consider the store to be fully loaded if the local count is equal to the total count
                    delete me.totalCount;

                    // For a buffered Store, we have to clear the prefetch cache because the dataset will change upon filtering.
                    // Then we must prefetch the new page 1, and when that arrives, reload the visible part of the Store
                    // via the guaranteedrange event
                    if (me.buffered) {
                        me.data.clear();
                        me.loadPage(1);
                    } else {
                        // Reset to the first page, clearing a filter will destroy the context of the current dataset
                        me.currentPage = 1;
                        me.load();
                    }
                } else if (me.isFiltered()) {
                    me.setRootNode(me.snapshot);
                    delete me.snapshot;

                    if (suppressEvent !== true) {
                        me.fireEvent('datachanged', me);
                        me.fireEvent('refresh', me);
                    }
                }

                if (me.sorters && me.sorters.items.length > 0) {
                    me.sort();
                }

                me.fireEvent('filterchange', me, me.filters.items);
            }

            ,
            isFiltered: function() {
                var snapshot = this.snapshot;
                return !!(snapshot && snapshot !== this.getRootNode());
            }

            ,
            addFilter: function(filters, applyFilters) {
                var me = this,
                    decoded,
                    i,
                    length;

                // Decode passed filters and replace/add into the filter set
                decoded = me.decodeFilters(filters);
                length = decoded.length;
                for (i = 0; i < length; i++) {
                    me.filters.replace(decoded[i]);
                }

                if (applyFilters !== false) {
                    me.filter();
                }
                me.fireEvent('filterchange', me, me.filters.items);
            }

            ,
            removeFilter: function(toRemove, applyFilters) {
                var me = this;

                if (!me.remoteFilter && me.isFiltered()) {
                    if (toRemove instanceof Ext.util.Filter) {
                        me.filters.remove(toRemove);
                    } else {
                        me.filters.removeAtKey(toRemove);
                    }

                    if (applyFilters !== false) {

                        // Not gone down to zero filters - re-filter Store
                        if (me.filters.getCount()) {
                            me.filter();
                        }

                        // No filters left - let clearFilter do its thing.
                        else {
                            me.clearFilter();
                        }
                    }
                    me.fireEvent('filterchange', me, me.filters.items);
                }
            }

            ,
            sortOnFilter: true,
            remoteFilter: false
        });

