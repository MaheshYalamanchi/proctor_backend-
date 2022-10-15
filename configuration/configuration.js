let active_config = async () => {
    try {
        var configuration = [
            "modular_monolithic"
        ]
        return configuration
    } catch (err) {
        return { status: false };
    }
};

let in_active_config = async () => {
    try {
        var configuration = [
            "polyglot"
        ]
        return configuration
    } catch (err) {
        return { status: false };
    }
};

module.exports = {
    active_config,
    in_active_config
};
