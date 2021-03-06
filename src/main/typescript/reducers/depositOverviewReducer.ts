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
import {
    DeleteState,
    DeletingStates,
    DepositOverviewState,
    Deposits,
    empty,
    emptyDelete,
    emptyDeleteStates,
    emptyDeposits,
} from "../model/Deposits"
import { Reducer } from "redux"
import { DepositOverviewConstants } from "../constants/depositOverviewConstants"

export const depositOverviewReducer: Reducer<DepositOverviewState> = (state = empty, action) => {
    switch (action.type) {
        case DepositOverviewConstants.FETCH_DEPOSITS_PENDING: {
            return { ...state, loading: { ...state.loading, loading: true, loadingError: undefined } }
        }
        case DepositOverviewConstants.FETCH_DEPOSITS_REJECTED: {
            return { ...state, loading: { ...state.loading, loading: false, loadingError: action.payload } }
        }
        case DepositOverviewConstants.FETCH_DEPOSITS_SUCCESS: {
            return { ...state, loading: { loading: false, loaded: true }, deposits: action.payload }
        }
        case DepositOverviewConstants.CLEAN_DEPOSITS: {
            return empty
        }
        case DepositOverviewConstants.DELETE_DEPOSIT_PENDING: {
            const { meta: { depositId } } = action

            const deleteState: DeleteState = state.deleting[depositId]
            const newDeleteState: DeleteState = deleteState
                ? { ...deleteState, deleting: true }
                : { ...emptyDelete, deleting: true }
            return { ...state, deleting: { ...state.deleting, [depositId]: newDeleteState } }
        }
        case DepositOverviewConstants.DELETE_DEPOSIT_REJECTED: {
            const { meta: { depositId }, payload: errorMessage } = action

            const deleteState: DeleteState = state.deleting[depositId]
            const newDeleteState: DeleteState = deleteState
                ? { ...deleteState, deleting: false, deleteError: errorMessage }
                : { ...emptyDelete, deleteError: errorMessage }

            return { ...state, deleting: { ...state.deleting, [depositId]: newDeleteState } }
        }
        case DepositOverviewConstants.DELETE_DEPOSIT_FULFILLED: {
            const { meta: { depositId } } = action

            const newDeposits: Deposits = Object.entries(state.deposits)
                .filter(([key]) => key !== depositId)
                .reduce((object, [key, value]) => ({ ...object, [key]: value }), emptyDeposits)

            const newDeleting: DeletingStates = Object.entries(state.deleting)
                .filter(([key]) => key !== depositId)
                .reduce((object, [key, value]) => ({ ...object, [key]: value }), emptyDeleteStates)

            return { ...state, deleting: newDeleting, deposits: newDeposits }
        }
        case DepositOverviewConstants.DELETE_DEPOSIT_CONFIRMATION: {
            const { meta: { depositId } } = action

            const deleteState: DeleteState = state.deleting[depositId]
            const newDeleteState: DeleteState = deleteState
                ? { ...deleteState, deleting: true }
                : { ...emptyDelete, deleting: true }

            return { ...state, deleting: { ...state.deleting, [depositId]: newDeleteState } }
        }
        case DepositOverviewConstants.DELETE_DEPOSIT_CANCELLED: {
            const { meta: { depositId } } = action

            const newDeleteState = Object.entries(state.deleting)
                .filter(([path]) => path !== depositId)
                .reduce((prev, [path, s]) => ({ ...prev, [path]: s }), emptyDeleteStates)

            return { ...state, deleting: newDeleteState }
        }
        case DepositOverviewConstants.CREATE_NEW_DEPOSIT_PENDING: {
            return { ...state, creatingNew: { creating: true } }
        }
        case DepositOverviewConstants.CREATE_NEW_DEPOSIT_SUCCESS: {
            return { ...state, creatingNew: { creating: false } }
        }
        case DepositOverviewConstants.CREATE_NEW_DEPOSIT_REJECTED: {
            return { ...state, creatingNew: { creating: false, createError: action.payload } }
        }
        default:
            return state
    }
}
