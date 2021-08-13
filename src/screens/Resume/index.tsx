import * as React from 'react'
import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    SelectIcon,
    Month,
} from './styles'
import { HistoryCard } from './../../components/HistoryCard/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
    total: number;
    totalFormated: string;
    color: string;
    percent: string;
}

export function Resume() {
    const [selectedDate, setSelectedDate] = React.useState(new Date);
    const [totalByCategories, setTotalByCategories] = React.useState<CategoryData[]>([])

    const theme = useTheme();

    function handleChangeDate(action: 'next'|'prev') {
        if(action === 'next'){
            const newDate = addMonths(selectedDate, 1)
            setSelectedDate(newDate);
        }else{
            const newDate = subMonths(selectedDate, 1)
            setSelectedDate(newDate);
        }
    }

    async function loadData() {
        const dataKey = "@gofinances:transactions";
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormated = response ? JSON.parse(response) : [];

        const expensives = responseFormated
        .filter((expensive: TransactionData) => 
            expensive.type === 'negative' &&
            new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensive.date).getFullYear() === selectedDate.getFullYear() 
        )

        const expensivesTotal = expensives
        .reduce((acumullator:number, expensive:TransactionData) => {
            return acumullator += Number(expensive.amount);
        },0);

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

                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total: categorySum,
                    totalFormated: total,
                    color: category.color,
                    percent
                })
            }
        })

        setTotalByCategories(totalByCategory)
    }

    React.useEffect(() => {        
        loadData()
    }, [selectedDate])

    return (
        <Container>
             <Header>
                <Title>
                    Resumo
                </Title>
            </Header>

            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingBottom: useBottomTabBarHeight(),
                }}
            >
                <MonthSelect>
                    <MonthSelectButton
                        onPress={() =>handleChangeDate('prev')}
                    >
                        <SelectIcon name="chevron-left" />
                    </MonthSelectButton>

                    <Month>
                        { format(selectedDate, 'MMMM, yyyy', {locale: ptBR}) }
                    </Month>

                    <MonthSelectButton
                        onPress={() => handleChangeDate('next')}
                    >
                        <SelectIcon name="chevron-right" />
                    </MonthSelectButton>
                </MonthSelect>

                <ChartContainer>
                    <VictoryPie
                        data={totalByCategories}
                        colorScale={totalByCategories.map(category => category.color)}
                        style={{
                            labels: {
                                fontSize: RFValue(18),
                                fontWeight: 'bold',
                                fill: theme.colors.shape,
                            }
                        }}
                        labelRadius={50}
                        x="percent"
                        y="total"
                    />
                </ChartContainer>

                {
                totalByCategories.map((item) => (
                    <HistoryCard
                        key={item.key}
                        title={item.name}
                        amount={item.totalFormated}
                        color={item.color}
                    />
                    ))
                }
            </Content>
        </Container>
    )
}