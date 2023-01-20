import express, {Request, Response} from "express";
import {videosRouter} from "./routes/videos-router";

const app = express()
const port = process.env.PORT || 5001
app.use(express.json())

enum STATUS {
    OK_200 = 200,
    CREATE_201 = 201,
    No_CONTENT_204 = 204,

    BAD_REQUEST_400 = 400,
    NOT_FOUND_404 = 404
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

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
});
app.delete('/testing/all-data', (req: Request, res: Response) => {
    videosDb = []
    res.sendStatus(STATUS.No_CONTENT_204)
});
app.use('videos', videosRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})