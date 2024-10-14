import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AmountLimit = {
  __typename?: 'AmountLimit';
  currencyType: Scalars['Float']['output'];
  max: Scalars['Float']['output'];
  min: Scalars['Float']['output'];
};

export type CommissionRateInfoOutput = {
  __typename?: 'CommissionRateInfoOutput';
  commissionRateLowersInfoForCurrencyTypesList: Array<CommissionRateLowersInfoForSpecialCurrencyTypesOutput>;
  value: Scalars['Float']['output'];
};

export type CommissionRateLower = {
  __typename?: 'CommissionRateLower';
  startAmount: Scalars['Float']['output'];
  value: Scalars['Float']['output'];
};

export type CommissionRateLowersInfoForSpecialCurrencyTypesOutput = {
  __typename?: 'CommissionRateLowersInfoForSpecialCurrencyTypesOutput';
  commissionRateLowersList: Array<CommissionRateLower>;
  currencyType: Scalars['Float']['output'];
};

export type ExchangeRate = {
  __typename?: 'ExchangeRate';
  type: Scalars['Float']['output'];
  value: Scalars['Float']['output'];
};

export type ExchangeRateSteamOutput = {
  __typename?: 'ExchangeRateSteamOutput';
  exchangeRatesSteamList: Array<ExchangeRate>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: Scalars['Boolean']['output'];
  topUpAccount: TopUpAccountOutput;
};


export type MutationCreateUserArgs = {
  input: UserCreateDto;
};


export type MutationTopUpAccountArgs = {
  input: TopUpAccountInput;
};

export type Query = {
  __typename?: 'Query';
  getExchangeRates: ExchangeRateSteamOutput;
  getTopUpAccountConfig: TopUpAccountConfigDtoOutput;
  getUsersList: Array<UserDto>;
};

export type Subscription = {
  __typename?: 'Subscription';
  topUpAccountPostbackNotificationEvent: TopUpAccountPostbackNotificationEvent;
};


export type SubscriptionTopUpAccountPostbackNotificationEventArgs = {
  eventId: Scalars['String']['input'];
};

export type TopUpAccountConfigDtoOutput = {
  __typename?: 'TopUpAccountConfigDTOOutput';
  amountForCurrenciesLimitsList: Array<AmountLimit>;
  commissionRateInfo: CommissionRateInfoOutput;
};

export type TopUpAccountInput = {
  account: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  currencyType: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  serviceLocalId: Scalars['Float']['input'];
};

export type TopUpAccountOutput = {
  __typename?: 'TopUpAccountOutput';
  eventId: Scalars['String']['output'];
  linkPagePay: Scalars['String']['output'];
  linkPagePayWithQRCode?: Maybe<Scalars['String']['output']>;
};

export type TopUpAccountPostbackNotificationEvent = {
  __typename?: 'TopUpAccountPostbackNotificationEvent';
  eventId: Scalars['String']['output'];
  isError?: Maybe<Scalars['Boolean']['output']>;
  message: Scalars['String']['output'];
};

export type UserCreateDto = {
  email?: InputMaybe<Scalars['String']['input']>;
  login?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type UserDto = {
  __typename?: 'UserDTO';
  createdat: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['Float']['output'];
  login?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
};

export type TopUpAccountMutationVariables = Exact<{
  amount: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  serviceLocalId: Scalars['Float']['input'];
  account: Scalars['String']['input'];
  email: Scalars['String']['input'];
  currencyType: Scalars['Float']['input'];
}>;


export type TopUpAccountMutation = { __typename?: 'Mutation', topUpAccount: { __typename?: 'TopUpAccountOutput', linkPagePay: string, linkPagePayWithQRCode?: string | null, eventId: string } };

export type CreateUserMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  login?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: boolean };

export type GetExchangeRateQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExchangeRateQuery = { __typename?: 'Query', getExchangeRates: { __typename?: 'ExchangeRateSteamOutput', exchangeRatesSteamList: Array<{ __typename?: 'ExchangeRate', type: number, value: number }> } };

export type GetTopUpAccountConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTopUpAccountConfigQuery = { __typename?: 'Query', getTopUpAccountConfig: { __typename?: 'TopUpAccountConfigDTOOutput', amountForCurrenciesLimitsList: Array<{ __typename?: 'AmountLimit', currencyType: number, min: number, max: number }>, commissionRateInfo: { __typename?: 'CommissionRateInfoOutput', value: number, commissionRateLowersInfoForCurrencyTypesList: Array<{ __typename?: 'CommissionRateLowersInfoForSpecialCurrencyTypesOutput', currencyType: number, commissionRateLowersList: Array<{ __typename?: 'CommissionRateLower', startAmount: number, value: number }> }> } } };

export type GetUsersListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersListQuery = { __typename?: 'Query', getUsersList: Array<{ __typename?: 'UserDTO', id: number, createdat: string, name?: string | null, email?: string | null, login?: string | null, password?: string | null }> };

export type TopUpAccountPostbackNotificationEventSubscriptionVariables = Exact<{
  eventId: Scalars['String']['input'];
}>;


export type TopUpAccountPostbackNotificationEventSubscription = { __typename?: 'Subscription', topUpAccountPostbackNotificationEvent: { __typename?: 'TopUpAccountPostbackNotificationEvent', eventId: string, message: string, isError?: boolean | null } };


export const TopUpAccountDocument = gql`
    mutation TopUpAccount($amount: Float!, $description: String, $serviceLocalId: Float!, $account: String!, $email: String!, $currencyType: Float!) {
  topUpAccount(
    input: {amount: $amount, description: $description, serviceLocalId: $serviceLocalId, account: $account, email: $email, currencyType: $currencyType}
  ) {
    linkPagePay
    linkPagePayWithQRCode
    eventId
  }
}
    `;
export type TopUpAccountMutationFn = Apollo.MutationFunction<TopUpAccountMutation, TopUpAccountMutationVariables>;

/**
 * __useTopUpAccountMutation__
 *
 * To run a mutation, you first call `useTopUpAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTopUpAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [topUpAccountMutation, { data, loading, error }] = useTopUpAccountMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      description: // value for 'description'
 *      serviceLocalId: // value for 'serviceLocalId'
 *      account: // value for 'account'
 *      email: // value for 'email'
 *      currencyType: // value for 'currencyType'
 *   },
 * });
 */
export function useTopUpAccountMutation(baseOptions?: Apollo.MutationHookOptions<TopUpAccountMutation, TopUpAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TopUpAccountMutation, TopUpAccountMutationVariables>(TopUpAccountDocument, options);
      }
export type TopUpAccountMutationHookResult = ReturnType<typeof useTopUpAccountMutation>;
export type TopUpAccountMutationResult = Apollo.MutationResult<TopUpAccountMutation>;
export type TopUpAccountMutationOptions = Apollo.BaseMutationOptions<TopUpAccountMutation, TopUpAccountMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($name: String, $login: String, $password: String, $email: String) {
  createUser(
    input: {name: $name, login: $login, password: $password, email: $email}
  )
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      name: // value for 'name'
 *      login: // value for 'login'
 *      password: // value for 'password'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const GetExchangeRateDocument = gql`
    query GetExchangeRate {
  getExchangeRates {
    exchangeRatesSteamList {
      type
      value
    }
  }
}
    `;

/**
 * __useGetExchangeRateQuery__
 *
 * To run a query within a React component, call `useGetExchangeRateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExchangeRateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExchangeRateQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetExchangeRateQuery(baseOptions?: Apollo.QueryHookOptions<GetExchangeRateQuery, GetExchangeRateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExchangeRateQuery, GetExchangeRateQueryVariables>(GetExchangeRateDocument, options);
      }
export function useGetExchangeRateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExchangeRateQuery, GetExchangeRateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExchangeRateQuery, GetExchangeRateQueryVariables>(GetExchangeRateDocument, options);
        }
export function useGetExchangeRateSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetExchangeRateQuery, GetExchangeRateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetExchangeRateQuery, GetExchangeRateQueryVariables>(GetExchangeRateDocument, options);
        }
export type GetExchangeRateQueryHookResult = ReturnType<typeof useGetExchangeRateQuery>;
export type GetExchangeRateLazyQueryHookResult = ReturnType<typeof useGetExchangeRateLazyQuery>;
export type GetExchangeRateSuspenseQueryHookResult = ReturnType<typeof useGetExchangeRateSuspenseQuery>;
export type GetExchangeRateQueryResult = Apollo.QueryResult<GetExchangeRateQuery, GetExchangeRateQueryVariables>;
export const GetTopUpAccountConfigDocument = gql`
    query GetTopUpAccountConfig {
  getTopUpAccountConfig {
    amountForCurrenciesLimitsList {
      currencyType
      min
      max
    }
    commissionRateInfo {
      value
      commissionRateLowersInfoForCurrencyTypesList {
        currencyType
        commissionRateLowersList {
          startAmount
          value
        }
      }
    }
  }
}
    `;

/**
 * __useGetTopUpAccountConfigQuery__
 *
 * To run a query within a React component, call `useGetTopUpAccountConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTopUpAccountConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTopUpAccountConfigQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTopUpAccountConfigQuery(baseOptions?: Apollo.QueryHookOptions<GetTopUpAccountConfigQuery, GetTopUpAccountConfigQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTopUpAccountConfigQuery, GetTopUpAccountConfigQueryVariables>(GetTopUpAccountConfigDocument, options);
      }
export function useGetTopUpAccountConfigLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTopUpAccountConfigQuery, GetTopUpAccountConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTopUpAccountConfigQuery, GetTopUpAccountConfigQueryVariables>(GetTopUpAccountConfigDocument, options);
        }
export function useGetTopUpAccountConfigSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTopUpAccountConfigQuery, GetTopUpAccountConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTopUpAccountConfigQuery, GetTopUpAccountConfigQueryVariables>(GetTopUpAccountConfigDocument, options);
        }
export type GetTopUpAccountConfigQueryHookResult = ReturnType<typeof useGetTopUpAccountConfigQuery>;
export type GetTopUpAccountConfigLazyQueryHookResult = ReturnType<typeof useGetTopUpAccountConfigLazyQuery>;
export type GetTopUpAccountConfigSuspenseQueryHookResult = ReturnType<typeof useGetTopUpAccountConfigSuspenseQuery>;
export type GetTopUpAccountConfigQueryResult = Apollo.QueryResult<GetTopUpAccountConfigQuery, GetTopUpAccountConfigQueryVariables>;
export const GetUsersListDocument = gql`
    query GetUsersList {
  getUsersList {
    id
    createdat
    name
    email
    login
    password
  }
}
    `;

/**
 * __useGetUsersListQuery__
 *
 * To run a query within a React component, call `useGetUsersListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersListQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersListQuery, GetUsersListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersListQuery, GetUsersListQueryVariables>(GetUsersListDocument, options);
      }
export function useGetUsersListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersListQuery, GetUsersListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersListQuery, GetUsersListQueryVariables>(GetUsersListDocument, options);
        }
export function useGetUsersListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetUsersListQuery, GetUsersListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersListQuery, GetUsersListQueryVariables>(GetUsersListDocument, options);
        }
export type GetUsersListQueryHookResult = ReturnType<typeof useGetUsersListQuery>;
export type GetUsersListLazyQueryHookResult = ReturnType<typeof useGetUsersListLazyQuery>;
export type GetUsersListSuspenseQueryHookResult = ReturnType<typeof useGetUsersListSuspenseQuery>;
export type GetUsersListQueryResult = Apollo.QueryResult<GetUsersListQuery, GetUsersListQueryVariables>;
export const TopUpAccountPostbackNotificationEventDocument = gql`
    subscription topUpAccountPostbackNotificationEvent($eventId: String!) {
  topUpAccountPostbackNotificationEvent(eventId: $eventId) {
    eventId
    message
    isError
  }
}
    `;

/**
 * __useTopUpAccountPostbackNotificationEventSubscription__
 *
 * To run a query within a React component, call `useTopUpAccountPostbackNotificationEventSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTopUpAccountPostbackNotificationEventSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopUpAccountPostbackNotificationEventSubscription({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useTopUpAccountPostbackNotificationEventSubscription(baseOptions: Apollo.SubscriptionHookOptions<TopUpAccountPostbackNotificationEventSubscription, TopUpAccountPostbackNotificationEventSubscriptionVariables> & ({ variables: TopUpAccountPostbackNotificationEventSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TopUpAccountPostbackNotificationEventSubscription, TopUpAccountPostbackNotificationEventSubscriptionVariables>(TopUpAccountPostbackNotificationEventDocument, options);
      }
export type TopUpAccountPostbackNotificationEventSubscriptionHookResult = ReturnType<typeof useTopUpAccountPostbackNotificationEventSubscription>;
export type TopUpAccountPostbackNotificationEventSubscriptionResult = Apollo.SubscriptionResult<TopUpAccountPostbackNotificationEventSubscription>;