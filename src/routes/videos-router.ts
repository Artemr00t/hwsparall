import {Request, Response, Router} from "express";
import {addDays} from "date-fns";

export const videosRouter = Router({})

enum STATUS {
    OK_200 = 200,
    CREATE_201 = 201,
    No_CONTENT_204 = 204,

    BAD_REQUEST_400 = 400,
    NOT_FOUND_404 = 404
}
enum ERRORS_MESSAGES {
    title_messages = 'Invalid title',
    title_field = 'title',

    author_messages = 'Invalid author',
    author_field = 'author',

    availableResolutions_message = 'Invalid availableResolutions',
    availableResolutions_field = 'availableResolutions',

    canBeDownloaded_message = 'Invalid canBeDownloaded',
    canBeDownloaded_field = 'canBeDownloaded',

    minAgeRestriction_message = 'Invalid minAgeRestriction',
    minAgeRestriction_field = 'minAgeRestriction',

    publicationDate_message = 'Invalid publicationDate',
    publicationDate_field = 'publicationDate'
}

type VideosDbType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: null
    createdAt: string
    publicationDate: string
    availableResolutions: Array<string>
};
let videosDb: VideosDbType[] = [];

const validateString = (str: string, lengthNumb: number) => !str || !str.trim() || str.length > lengthNumb;
const validateNotBoolean = (value: any) => typeof value !== 'boolean';
const validateAge = (age: number) => age > 18 || age < 0;
const validateNotDate = (date: any) => typeof date !== 'string';

videosRouter.get('/', (req: Request, res: Response) => {
    res.status(STATUS.OK_200).send(videosDb)
});
videosRouter.get('//:id', (req: Request, res: Response) => {
    const videoById = videosDb.find(v => v.id === +req.params.id);
    return videoById
        ? res.status(STATUS.OK_200).send(videoById)
        : res.sendStatus(STATUS.NOT_FOUND_404);
});
videosRouter.post('/', (req: Request, res: Response) => {
    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions

    let errors = []
    if (validateString(title, 40)){
        errors.push({message: ERRORS_MESSAGES.title_messages, field: ERRORS_MESSAGES.title_field})
    }
    if (validateString(author, 20)){
        errors.push({message: ERRORS_MESSAGES.author_messages, field: ERRORS_MESSAGES.author_field})
    }
    for (const i in availableResolutions) {
        if (availableResolutions[i].length > 5){
            errors.push({message: ERRORS_MESSAGES.availableResolutions_message, field: ERRORS_MESSAGES.availableResolutions_field})
        }
    }
    if (errors.length > 0) {
        return res.status(STATUS.BAD_REQUEST_400).send({errorsMessages: errors})
    }

    const dateNow = new Date()
    const createNewVideo = {
        id: +dateNow,
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: dateNow.toISOString(),
        publicationDate: addDays(dateNow, 1).toISOString(),
        availableResolutions
    }
    videosDb.push(createNewVideo)
    res.status(STATUS.CREATE_201).send(createNewVideo)
});
videosRouter.put('/:id', (req: Request, res: Response) => {
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const canBeDownloaded = req.body.canBeDownloaded;
    const minAgeRestriction = req.body.minAgeRestriction;
    const publicationDate = req.body.publicationDate;

    let errors = []
    if (validateString(title, 40)){
        errors.push({message: ERRORS_MESSAGES.title_messages, field: ERRORS_MESSAGES.title_field})
    }
    if (validateString(author, 20)){
        errors.push({message: ERRORS_MESSAGES.author_messages, field: ERRORS_MESSAGES.author_field})
    }
    for (const i in availableResolutions) {
        if (availableResolutions[i].length > 5){
            errors.push({message: ERRORS_MESSAGES.availableResolutions_message, field: ERRORS_MESSAGES.availableResolutions_field})
        }
    }
    if (validateNotBoolean(canBeDownloaded)) {
        errors.push({message: ERRORS_MESSAGES.canBeDownloaded_message, field: ERRORS_MESSAGES.canBeDownloaded_field})}
    if (validateAge(minAgeRestriction)) {
        errors.push({message: ERRORS_MESSAGES.minAgeRestriction_message, field: ERRORS_MESSAGES.minAgeRestriction_field})}
    if (validateNotDate(publicationDate)) {
        errors.push({message: ERRORS_MESSAGES.publicationDate_message, field: ERRORS_MESSAGES.publicationDate_field})}
    if (errors.length > 0) {return res.status(STATUS.BAD_REQUEST_400).send({errorsMessages: errors})}

    let updateVideo = videosDb.find(v => v.id === +req.params.id);
    return updateVideo
        ?  (updateVideo.title = title,
            updateVideo.author = author,
            updateVideo.availableResolutions = availableResolutions,
            updateVideo.canBeDownloaded = canBeDownloaded,
            updateVideo.minAgeRestriction = minAgeRestriction,
            updateVideo.publicationDate = publicationDate,
            res.status(STATUS.No_CONTENT_204).send(updateVideo))
        : (res.sendStatus(STATUS.NOT_FOUND_404))
});
videosRouter.delete('/:id', (req: Request, res: Response) => {
    for (let i = 0; i < videosDb.length; i++) {
        if (videosDb[i].id === +req.params.id){
            videosDb.splice(i, 1);
            res.sendStatus(STATUS.No_CONTENT_204)
            return
        }
    }
    res.sendStatus(STATUS.NOT_FOUND_404)
});