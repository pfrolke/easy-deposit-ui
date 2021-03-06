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
export enum DepositFormConstants {
    UNREGISTER_FORM = "UNREGISTER_FORM",

    FETCH_STATE = "FETCH_STATE",
    FETCH_STATE_PENDING = "FETCH_STATE_PENDING",
    FETCH_STATE_FULFILLED = "FETCH_STATE_FULFILLED",
    FETCH_STATE_REJECTED = "FETCH_STATE_REJECTED",
    FETCH_STATE_SUCCESS = "FETCH_STATE_SUCCESS",
    FETCH_STATE_NOT_FOUND = "FETCH_STATE_NOT_FOUND",

    FETCH_METADATA = "FETCH_METADATA",
    FETCH_METADATA_PENDING = "FETCH_METADATA_PENDING",
    FETCH_METADATA_FULFILLED = "FETCH_METADATA_FULFILLED",
    FETCH_METADATA_REJECTED = "FETCH_METADATA_REJECTED",
    FETCH_METADATA_SUCCESS = "FETCH_METADATA_SUCCESS",

    FETCH_DOI = "FETCH_DOI",
    FETCH_DOI_PENDING = "FETCH_DOI_PENDING",
    FETCH_DOI_FULFILLED = "FETCH_DOI_FULFILLED",
    FETCH_DOI_REJECTED = "FETCH_DOI_REJECTED",
    FETCH_DOI_SUCCESS = "FETCH_DOI_SUCCESS",

    SAVE_DRAFT = "SAVE_DRAFT",
    SAVE_DRAFT_PENDING = "SAVE_DRAFT_PENDING",
    SAVE_DRAFT_FULFILLED = "SAVE_DRAFT_FULFILLED",
    SAVE_DRAFT_REJECTED = "SAVE_DRAFT_REJECTED",
    SAVE_DRAFT_RESET = "SAVE_DRAFT_RESET",

    SUBMIT_DEPOSIT = "SUBMIT_DEPOSIT",
    SUBMIT_DEPOSIT_PENDING = "SUBMIT_DEPOSIT_PENDING",
    SUBMIT_DEPOSIT_FULFILLED = "SUBMIT_DEPOSIT_FULFILLED",
    SUBMIT_DEPOSIT_REJECTED = "SUBMIT_DEPOSIT_REJECTED",
}

export const depositFormName = "depositForm"
export const saveDraftResetTimeout = 5 // seconds
