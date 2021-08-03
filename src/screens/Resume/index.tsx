import * as React from 'react'
import {
    Container,
    Header,
    Content
} from './styles'

import { HistoryCard } from './../../components/HistoryCard/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { categories } from '../../utils/categories';

interface TransactionData {
    type: "positive" | "negative";
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: string;
    color: string;
}

export function Resume() {
    const [totalByCategories, setTotalByCategories] = React.useState<CategoryData[]>([])

    async function loadData() {
        const dataKey = "@gofinances:transactions";
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormated = response ? JSON.parse(response) : [];

        const expensives = responseFormated
        .filter((expensive: TransactionData) => expensive.type === 'negative')

        const totalByCategory: CategoryData[] = []

        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData) => {
                if(expensive.category === category.key) {
                    categorySum += Number(expensive.amount)
                }
            })

            if(categorySum > 0){
                const total = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total,
                    color: category.color
                })
            }
        })

        setTotalByCategories(totalByCategory)
    }

    React.useEffect(() => {
        loadData()
    }, [])

    return (
        <Container>
            <Header>Resumo</Header>

            <Content>
                {
                totalByCategories.map((item) => (
                    <HistoryCard
                        key={item.key}
                        title={item.name}
                        amount={item.total}
                        color={item.color}
                    />
                    ))
                }
            </Content>
        </Container>
    )
}