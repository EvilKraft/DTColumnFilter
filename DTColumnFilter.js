function attachColumnFilter( settings ) {
    const api = new DataTable.Api(settings);
    const init = api.init();

    // noinspection JSUnresolvedReference
    const enabled = init.DTColumnFilter ?? DataTable.defaults.DTColumnFilter ?? true;

    if (!enabled) {
        return;
    }

    // Защита от повторной инициализации
    if (settings._columnFilterAttached) {
        return;
    }
    settings._columnFilterAttached = true;


    // noinspection JSUnresolvedReference
    const selectFilter = api.ajax.json().select_filter ?? [];
    const escapeRegex = DataTable.util.escapeRegex;


    api.columns('.select-filter').every( function () {
        const column = this;
        const headerNode = column.header();
        const title = headerNode?.textContent?.trim() || '';
        const titleAll   = title + ' (All)';
        const titleEmpty = title + ' (Empty)';

        // очищаем заголовок
        headerNode.innerHTML = '';

        // создаём select
        const select = document.createElement('select');
        select.className = 'form-select';
        select.style.width = '100%';
        select.style.padding = '0';
        select.style.height = '20px';
        select.innerHTML =
            `<option selected value="">${titleAll}</option>` +
            `<option value="##Empty##">${titleEmpty}</option>`;

        headerNode.appendChild(select);

        select.addEventListener('change', function () {
            const val = escapeRegex(this.value);

            if (val === '##Empty##') {
                column.search('^$', true, false).draw();
            } else {
                //column.search( val ? '^'+val+'$' : '', true, false ).draw();
                column.search( val ? '' + val + '' : '', true, false).draw();
            }
        });

        select.addEventListener('click', function (event) {
            event.stopPropagation();
        });

        const selectValues = (column.name() in selectFilter)
            ? selectFilter[column.name()]
            : column.data().unique().sort().toArray();

        selectValues.forEach((d) => {
            if (d === null || d === undefined) {
                return;
            }

            const val = escapeRegex(d);
            const option = document.createElement('option');
            option.value = d;
            option.textContent = d;

            // if (column.search() === "^" + val + "$") {
            if (column.search() === '' + val + '') {
                option.selected = true;
            }

            select.appendChild(option);
        });
    });
}

// Глобальное подключение для всех таблиц
/*
if (typeof DataTable.on === 'function') {
    DataTable.on('init', (e, settings) => {
        attachColumnFilter(settings);
    });
} else {
    // Fallback, если вдруг глобального DataTable.on нет
    const oldInitComplete = DataTable.defaults.initComplete;

    DataTable.defaults.initComplete = function (settings, json) {
        if (typeof oldInitComplete === 'function') {
            oldInitComplete.call(this, settings, json);
        }

        attachColumnFilter(settings);
    };
}
*/
$(document).on( 'init.dt', function ( e, settings ) {
    attachColumnFilter( settings );
});
