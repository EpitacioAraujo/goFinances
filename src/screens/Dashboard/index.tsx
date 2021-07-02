import React from 'react';

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    LogoutButton,
    Icon,
    HighLightCards,
    Transactions,
    Title,
    TransactionsList
} from './styles';

import { HighLightCard } from '../../components/HighLightCard';
import { TransactionCard, TransactionCardProps } from './../../components/TransactionCard';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard() {
    const data: DataListProps[] = [
        {
            id: '1',
            type: "positive",
            title: "Desenvolvimento de site",
            amount: "R$ 12.000,00",
            category: {
                name: "Vendas",
                icon: "dollar-sign"
            },
            date: "13/04/2020"
        },
        {
            id: '2',
            type: "negative",
            title: "Desenvolvimento de site",
            amount: "R$ 12.000,00",
            category: {
                name: "Vendas",
                icon: "coffee"
            },
            date: "13/04/2020"
        },
        {
            id: '3',
            type: "positive",
            title: "Desenvolvimento de site",
            amount: "R$ 12.000,00",
            category: {
                name: "Vendas",
                icon: "home"
            },
            date: "13/04/2020"
        }
    ]

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{ uri: 'https://github.com/EpitacioAraujo.png' }} />
                        <User>
                            <UserGreeting>Olá, </UserGreeting>
                            <UserName>Epitacio</UserName>
                        </User>
                    </UserInfo>

                    <LogoutButton onPress={() => { }} >
                        <Icon name="power" />
                    </LogoutButton>
                </UserWrapper>
            </Header>

            <HighLightCards>
                <HighLightCard
                    type="up"
                    title="Entradas"
                    amount="R$ 17.400,00"
                    lastTansaction="Última entrada dia 13 de abril"
                />

                <HighLightCard
                    type="down"
                    title="Saidas"
                    amount="R$ 1.259,00"
                    lastTansaction="Última entrada dia 03 de abril"
                />
                <HighLightCard
                    type="total"
                    title="Total"
                    amount="R$ 16.141,00"
                    lastTansaction="01 à 06 de abril"
                />
            </HighLightCards>

            <Transactions>
                <Title>Listagem</Title>

                <TransactionsList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />
            </Transactions>
        </Container>
    )
}