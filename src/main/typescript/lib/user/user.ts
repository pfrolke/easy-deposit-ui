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
import { UserDetails } from "../../model/UserDetails"

export const userConverter: (input: any) => UserDetails = input => {
    const firstName = input.firstName ? `${input.firstName} ` : ""
    const prefix = input.prefix ? `${input.prefix} ` : ""
    const lastName = input.lastName || ""
    const displayName = `${firstName}${prefix}${lastName}`

    return {
        username: input.username || "",
        firstName: input.firstName || "",
        prefix: input.prefix || "",
        lastName: input.lastName || "",
        groups: input.groups || [],
        displayName: displayName,
    }
}