import * as React from "react"
import { Component } from "react"
import { connect } from "react-redux"
import { AppState } from "../../model/AppState"
import { DatasetId, Deposit, Deposits } from "../../model/Deposits"
import { cleanDeposits, deleteDeposit, fetchDeposits } from "../../actions/depositActions"
import { ReduxAction } from "../../lib/redux"
import Table from "./DepositTable"
import { Action } from "redux"

interface DepositOverviewProps {
    deposits: Deposits
    fetchDeposits: () => ReduxAction<Promise<Deposit[]>>
    cleanDeposits: () => Action
    deleteDeposit: (id: DatasetId) => ReduxAction<Promise<void>>
}

class DepositOverview extends Component<DepositOverviewProps> {
    constructor(props: DepositOverviewProps) {
        super(props)
    }

    componentDidMount() {
        this.props.fetchDeposits()
    }

    componentWillUnmount() {
        this.props.cleanDeposits()
    }

    render() {
        const { deposits: { loading: {loading, loaded, loadingError}, deleting, deposits } } = this.props

        const init = loading && <p>loading data...</p>
        const err = loadingError &&
            <p style={{ color: "red" }}>An error occured: {loadingError}. Cannot load data from the server. Please report this incident
                at <a href="mailto:info@dans.knaw.nl">info@dans.knaw.nl</a>.</p>
        const data = loaded && <Table deposits={deposits} deleteDeposit={this.props.deleteDeposit} deletingStates={deleting}/>

        return (
            <>
                {init}
                {err}
                {data}
            </>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    deposits: state.deposits,
})

export default connect(mapStateToProps, { fetchDeposits, cleanDeposits, deleteDeposit })(DepositOverview)
