/*
 * Copyright (C) 2018 DANS - Data Archiving and Networked Services (info@dans.knaw.nl)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as express from "express"
import { Request, Response } from "express"
import * as bodyParser from "body-parser"
import * as cors from "cors"
import * as fileUpload from "express-fileupload"
import { UploadedFile } from "express-fileupload"
import {
    addFile,
    createDeposit,
    deleteDeposit,
    deleteFile,
    getDeposit,
    getDoi,
    getFilesListing,
    getMetadata,
    getState,
    getUser,
    hasMetadata,
    listDeposits,
    setMetadata,
    setState,
} from "./db"

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload())

app.get("/deposit", (req: Request, res: Response) => {
    console.log("GET /deposit")
    res.status(200)
    res.json(listDeposits())
    console.log("  200")
})
app.get("/deposit401", (req: Request, res: Response) => {
    console.log("GET /deposit")
    res.status(401)
    res.send("You are not authorized")
    console.log("  401")
})
app.post("/deposit", (req: Request, res: Response) => {
    console.log("POST /deposit")
    res.status(201)
    res.json(createDeposit())
    console.log("  201")
})
app.post("/deposit401", (req: Request, res: Response) => {
    console.log("POST /deposit")
    res.status(401)
    res.send("You are not authorized")
    console.log("  401")
})

app.get("/deposit/:id", (req: Request, res: Response) => {
    console.log(`GET /deposit/${req.params.id}`)
    res.status(200)
    res.json(getDeposit(req.params.id))
    console.log("  200")
})
app.get("/deposit401/:id", (req: Request, res: Response) => {
    console.log(`GET /deposit/${req.params.id}`)
    res.status(401)
    res.send("You are not authorized")
    console.log("  401")
})
app.delete("/deposit/:id", (req: Request, res: Response) => {
    console.log(`DELETE /deposit/${req.params.id}`)
    if (deleteDeposit(req.params.id)) {
        res.status(204)
        res.send("Resource deleted.")
        console.log("  204")
    }
    else {
        res.status(404)
        res.send("Not found.")
        console.log("  404")
    }
})
app.delete("/deposit401/:id", (req: Request, res: Response) => {
    console.log(`DELETE /deposit/${req.params.id}`)
    res.status(401)
    res.send("You are not authorized")
    console.log("  401")
})

app.get("/deposit/:id/metadata", (req: Request, res: Response) => {
    console.log(`GET /deposit/${req.params.id}/metadata`)
    if (hasMetadata(req.params.id)) {
        const result = getMetadata(req.params.id)
        if (result) {
            res.status(200)
            res.json(result)
            console.log("  200")
        }
        else {
            res.status(410)
            res.send("Gone. The metadata is no longer available, because the deposit has been fully processed.")
            console.log("  410")
        }
    }
    else {
        res.status(404)
        res.send("Not found. The client may derive from this response that the containing deposit does not exist, either.")
        console.log("  404")
    }
})
app.get("/deposit401/:id/metadata", (req: Request, res: Response) => {
    console.log(`GET /deposit/${req.params.id}/metadata`)
    res.status(401)
    res.send("You are not authorized")
    console.log("  401")
})
app.put("/deposit/:id/metadata", (req: Request, res: Response) => {
    console.log(`PUT /deposit/${req.params.id}/metadata`)
    if (hasMetadata(req.params.id)) {
        setMetadata(req.params.id, req.body)
        res.status(204)
        res.send("Dataset metadata written successfully.")
        console.log("  204")
    }
    else {
        res.status(404)
        res.send("Not found. The client may derive from this response that the containing deposit does not exist, either.")
        console.log("  404")
    }
})
app.put("/deposit401/:id/metadata", (req: Request, res: Response) => {
    console.log(`PUT /deposit/${req.params.id}/metadata`)
    res.status(401)
    res.send("You are not authorized")
    console.log("  401")
})

app.get("/deposit/:id/doi", (req: Request, res: Response) => {
    console.log(`GET /deposit/${req.params.id}/doi`)
    if (hasMetadata(req.params.id)) {
        const doi = getDoi(req.params.id)
        if (doi) {
            res.status(200)
            res.json({ doi: doi })
            console.log("  200")
        }
        else {
            res.status(404)
            res.send("Not found. The client may derive from this response that the containing deposit does not exist, either.")
        }
    }
    else {
        res.status(404)
        res.send("Not found. The client may derive from this response that the containing deposit does not exist, either.")
    }
})
app.get("/deposit401/:id/doi", (req: Request, res: Response) => {
    console.log(`GET /deposit/${req.params.id}/doi`)
    res.status(401)
    res.send("You are not authorized")
    console.log("  401")
})

app.get("/deposit/:id/state", (req: Request, res: Response) => {
    console.log(`GET /deposit/${req.params.id}/state`)
    const state = getState(req.params.id)
    if (state) {
        res.status(200)
        res.json(state)
        console.log("  200")
    }
    else {
        res.status(404)
        res.send("Not found. The client may derive from this response that the containing deposit does not exist, either.")
        console.log("  404")
    }
})
app.get("/deposit401/:id/state", (req: Request, res: Response) => {
    console.log(`GET /deposit/${req.params.id}/state`)
    res.status(401)
    res.send("You are not authorized")
    console.log("  401")
})
app.put("/deposit/:id/state", (req: Request, res: Response) => {
    console.log(`PUT /deposit/${req.params.id}/state`)
    const body = req.body
    if (Object.keys(body).filter(value => value !== "state" && value !== "stateDescription").length === 0) {
        const state = getState(req.params.id)
        if (state) {
            if (state.state === "DRAFT" && body.state === "SUBMITTED" || state.state === "REJECTED" && body.state === "DRAFT") {
                if (setState(req.params.id, body)) {
                    res.status(204)
                    res.send("Successfully updated the deposit state.")
                    console.log("  204")
                }
                else {
                    res.status(404)
                    res.send("Not found. The client may derive from this response that the containing deposit does not exist, either.")
                    console.log("  404")
                }
            }
            else {
                res.status(403)
                res.send("Forbidden. Insufficient credentials or illegal state transition. (Only allowed to transition from DRAFT to SUBMITTED and from REJECTED to DRAFT.)")
                console.log("  403")
            }
        }
        else {
            res.status(404)
            res.send("Not found. The client may derive from this response that the containing deposit does not exist, either.")
            console.log("  404")
        }
    }
    else {
        res.status(400)
        res.send("Bad request. State document is malformed.")
        console.log("  400")
    }
})
app.put("/deposit401/:id/state", (req: Request, res: Response) => {
    console.log(`PUT /deposit/${req.params.id}/state`)
    res.status(401)
    res.send("You are not authorized")
    console.log("  401")
})

app.get("/deposit/:id/file/:dir_path*?", (req: Request, res: Response) => {
    const depositId = req.params.id
    const dir_path = req.params.dir_path
    const restPath = req.params[0]
    const dirPath = dir_path && restPath ? dir_path + restPath : dir_path
    console.log(`GET /deposit/${depositId}/file${dirPath ? `/${dirPath}` : ""}`)

    if (dirPath) {
        res.status(501)
        res.send("not yet implemented")
        console.log("  501")
    }
    else {
        const files = getFilesListing(depositId)
        if (files) {
            res.status(200)
            res.json(files)
            console.log("  200")
        }
        else {
            res.status(404)
            res.send("Not found. The client may derive from this response that the containing deposit does not exist, either.")
            console.log("  404")
        }
    }
})
app.get("/deposit401/:id/file/:dir_path*?", (req: Request, res: Response) => {
    const dir_path = req.params.dir_path
    const restPath = req.params[0]
    const dirPath = dir_path && restPath ? dir_path + restPath : (dir_path || "")
    console.log(`GET /deposit/${req.params.id}/file/${dirPath}`)
    res.status(401)
    res.send("You are not authorized")
    console.log("  401")
})
app.post("/deposit/:id/file/:dir_path*?", async (req: Request, res: Response) => {
    const depositId = req.params.id
    const dir_path = req.params.dir_path
    const restPath = req.params[0]
    const dirPath = dir_path && restPath ? dir_path + restPath : (dir_path || "")
    console.log(`POST /deposit/${depositId}/file/${dirPath}`)

    if (!req.files)
        return res.status(400).send("No files were uploaded.")

    try {
        const promises: Promise<string>[] = Object.values(req.files)
            .map(file => {
                const uploadedFile = file as UploadedFile

                return new Promise<string>((resolve, reject) => {
                    uploadedFile.mv(`./target/build-mockserver/${uploadedFile.name}`, err => {
                        if (err)
                            return reject(err)
                        else if (addFile(depositId, "/" + dirPath, uploadedFile.name))
                            resolve(uploadedFile.name)
                        else
                            return reject(err)
                    })
                })
            })

        const newFiles = await Promise.all(promises)

        res.status(201)
        res.send(`Files uploaded: [${newFiles.join(", ")}]!`)
        console.log("  201")
    }
    catch (err) {
        res.status(500).send(err)
        console.log("  500")
    }
})
app.post("/deposit401/:id/file/:dir_path*?", (req: Request, res: Response) => {
    const dir_path = req.params.dir_path
    const restPath = req.params[0]
    const dirPath = dir_path && restPath ? dir_path + restPath : (dir_path || "")
    console.log(`POST /deposit/${req.params.id}/file/${dirPath}`)
    res.status(401)
    res.send("You are not authorized")
    console.log("  401")
})
app.put("/deposit/:id/file/:file_path", (req: Request, res: Response) => {
    console.log(`PUT /deposit/${req.params.id}/file${req.params.file_path ? `/${req.params.file_path}` : ""}`)

    res.status(501)
    res.send("not yet implemented")
    console.log("  501")
})
app.delete("/deposit/:id/file/:dir_path*?", (req: Request, res: Response) => {
    const depositId = req.params.id
    const dir_path = req.params.dir_path
    const restPath = req.params[0]
    const dirPath = dir_path && restPath ? dir_path + restPath : dir_path
    console.log(`DELETE /deposit/${depositId}/file${dirPath ? `/${dirPath}` : ""}`)

    if (deleteFile(depositId, dirPath ? "/" + dirPath : "/")) {
        res.status(204)
        res.send("Resource deleted.")
        console.log("  204")
    }
    else {
        res.status(404)
        res.send("Not found.")
        console.log("  404")
    }
})
app.delete("/deposit401/:id/file/:dir_path*?", (req: Request, res: Response) => {
    const dir_path = req.params.dir_path
    const restPath = req.params[0]
    const dirPath = dir_path && restPath ? dir_path + restPath : (dir_path || "")
    console.log(`DELETE /deposit/${req.params.id}/file/${dirPath}`)
    res.status(401)
    res.send("You are not authorized")
    console.log("  401")
})

app.get("/user", (req: Request, res: Response) => {
    console.log("GET /user")
    res.status(200)
    res.json(getUser())
    console.log("  200")
})
app.get("/user401", (req: Request, res: Response) => {
    console.log("GET /user")
    res.status(401)
    res.send("you are not authorized")
    console.log("  401")
})

app.listen(3004, () => console.log("Running on localhost:3004"))
