export const PINSTON_API = {
    execute: "https://emkc.org/api/v2/piston/execute"
}

export const REGEX = {
    onFindOrganizationNameInFrontendURL: /(?<=\/\/)([^.]+)(?=\.)/,
    findWhiteSpace: /\s+/g,
}

export const REDIS_KEY_PREFIX = {
    Job: "Job_"
};