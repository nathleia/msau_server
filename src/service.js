const MsauService = {
    getCodeGeom(knex, username, password) {
        return knex.raw(`
        with unnesting as (
            select unnest (mc.codes) as codes
            from msau_creds mc 
            where mc.username = '${username}'
                and mc."password" = '${password}'
        )
        
        select un.codes, st_astext(st_union(sa.geom)) as geom
        from unnesting un
        join serviceareas_test sa
            on un.codes = sa.dccode
        group by un.codes
        `)
    },

    getLogin(knex, username, password) {
        return knex.raw(`
            select codes
            from msau_creds
            where username = '${username}'
            and password = '${password}'
        `)
    },

    editSubmission(knex, drawGeom, buffer) {
        let bufferSize
        if (buffer) {
            if (parseInt(buffer) > 25) {
                bufferSize = buffer
            } else {
                bufferSize = '25'
            }
        } else {
            bufferSize = '25'
        }
        bufferSize = parseInt(bufferSize) / 3.281
        drawGeom.forEach(element => {
            if (element.operation === 'addition') {
                if (element.type !== 'Polygon') {
                    console.log(element.operation)
                    console.log(element.type)
                    console.log(element.string)
                    console.log(bufferSize)
                    query = `insert into serviceareas_test (geom, dccode) values (st_multi(st_makevalid((st_buffer(ST_GeomFromText('${element.string}', 4326)::geography, ${bufferSize}))::geometry)),'${element.code}')`
                    console.log(query)
                    return knex.raw(`
                                insert into serviceareas_test (geom, dccode) values (st_multi(st_makevalid((st_buffer(ST_GeomFromText('${element.string}', 4326)::geography, ${bufferSize}))::geometry)),'${element.code}')
                `)
                } else {
                    // if it's an addition and a polygon
                }
            } else {
                if (element.type !== 'Polygon') {
                    // if subtraction and not a polygon
                } else {
                    // it's a subtraction and it is a polgone
                }
            }
        })
    }

}

module.exports = MsauService