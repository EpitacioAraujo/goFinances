import React, { useCallback, useEffect, useState } from 'react';
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
    TransactionsList,
    LoadContainer
} from './styles';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { HighLightCard } from '../../components/HighLightCard';
import { TransactionCard, TransactionCardProps } from './../../components/TransactionCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighLightProps {
    amount: string;
    lasTransaction: string;

}

interface HighLightData {
    entries: HighLightProps;
    expensives: HighLightProps;
    total: HighLightProps
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highLightData, setHighLightData] = useState<HighLightData>({} as HighLightData);
    const theme = useTheme();

    function getLastTransacitionDae(
        collection: DataListProps[], 
        type: 'positive' | 'negative'
    ) {
        const lastTransaction = new Date(
            Math.max.apply(
                Math,   
                collection
                .filter((transaction) => transaction.type === type)
                .map((transaction) => new Date(transaction.date).getTime())
                )
        )

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {month: 'long'})}`;
    }

    async function loadTransactions(){
        let entriesTotal = 0;
        let expensive = 0;

        const dataKey = "@gofinances:transactions";
        const response = await AsyncStorage.getItem(dataKey);

        const transactions = response ? JSON.parse(response) : [];

        const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {
            if(item.type == 'positive'){
                entriesTotal += Number(item.amount);
            }else {
                expensive += Number(item.amount);
            }

            const amount = Number(item.amount)
                .toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date
            }
        })

        setTransactions(transactionsFormatted);

        const lastTansactionEntries = getLastTransacitionDae(transactions, 'positive');
        const lastTansactionExpensives = getLastTransacitionDae(transactions, 'negative');
        const totalInterval = `01 à ${lastTansactionExpensives}`

        const total = entriesTotal - expensive;

        setHighLightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lasTransaction: `Última entrada dia ${lastTansactionEntries}`
            },
            expensives: {
                amount: expensive.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lasTransaction: `Última saída dia ${lastTansactionExpensives}`
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lasTransaction: totalInterval
            }
        })

        setIsLoading(false)
    }

    useEffect(() => {
        loadTransactions();
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []))

    return (
        <Container>
            {isLoading ? 
                <LoadContainer>
                    <ActivityIndicator 
                        color={theme.colors.primary} 
                        size="large"
                    /> 
                </LoadContainer> 
                :
                <>
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
                            amount={highLightData.entries?.amount}
                            lastTansaction={highLightData.entries?.lasTransaction}
                        />

                        <HighLightCard
                            type="down"
                            title="Saidas"
                            amount={highLightData.expensives?.amount}
                            lastTansaction={highLightData.expensives?.lasTransaction}
                        />
                        <HighLightCard
                            type="total"
                            title="Total"
                            amount={highLightData.total?.amount}
                            lastTansaction={highLightData.total?.lasTransaction}
                        />
                    </HighLightCards>

                    <Transactions>
                <Title>Listagem</Title>

                <TransactionsList
                    data={transactions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />
            </Transactions>
                </>
            }
        </Container>
    )
}