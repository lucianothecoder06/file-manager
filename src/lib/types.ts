export type Dir = {
    name: string, 
    path: string,
    is_dir: boolean,
    last_accessed: {
        nanos_since_epoch: number,
        secs_since_epoch: number,
    },
    file_type: string,
}