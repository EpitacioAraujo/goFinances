import React from 'react'
import {
    Container,
    Header
} from './styles'

import { HistoryCard } from './../../components/HistoryCard/index';

export function Resume() {
    return (
        <Container>
            <Header>Resumo</Header>

            <HistoryCard
                title='compras'
                amount='R$ 150,50'
                color='red'
            />
        </Container>
    )
}