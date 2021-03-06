module.exports = {

    AUTH: {
        ROLES: {
            super: { key: 'super', value: 'Super Admin' },
            admin: { key: 'admin', value: 'Administrator' },
            moderator: { key: 'moderator', value: 'Moderator' },
            player: { key: 'player', value: 'Player' },
            deleted: { key: 'deleted', value: 'Deleted' },

            anyone: { key: 'anyone', value: 'Anyone' }
        },
        TEAM: {
            ns: { key: 'ns', value: 'Northern Stars' },
            other: { key: 'other', value: 'Other' }
        }
    },

    SYSTEM: {
        ENVIRONMENT: {
            development: { key: 'development', value: 'Development' },
            test: { key: 'test', value: 'Testing' },
            production: { key: 'production', value: 'Production' }
        }
    }

};