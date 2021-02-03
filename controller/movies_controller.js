const db = require('../database')
const {no2Query, asyncQuery} = require('../helper/query')

module.exports = {
    getAll: async (req, res) => {
        try {
            const qall = `select m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, m.description, ms.status, l.location, st.time 
                            from movies m join movie_status ms on m.status = ms.id
                            join schedules s on s.movie_id = m.id
                            join locations l on l.id = s.location_id
                            join show_times st on st.id = s.time_id;`
            const result = await asyncQuery(qall)
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    getSpecific : async (req, res) => {

        try {
            const qget = `select m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, m.description, ms.status, l.location, st.time 
                            from movies m join movie_status ms on m.status = ms.id
                            join schedules s on s.movie_id = m.id
                            join locations l on l.id = s.location_id
                            join show_times st on st.id = s.time_id
                            where${no2Query(req.query)} `
            console.log(req.query)
            const result = await asyncQuery(qget)
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
        }
    }
}