import React from 'react';
import { useRouter } from 'next/router'
import firebase from '../lib/firebaseClient';
import { nanoid } from 'nanoid'

// カスタムフックにしておく
// const useDatabase = () => {
//   // 同じパスでは毎回同じ結果が得られるのでmemo化しておく
//   return useMemo(() => firebase.database().ref('/sample'), []);
// };

// hooksを使いたいのでカスタムhooksにしておく
// const useFetchData = (ref: firebase.database.Reference, user: object | null) => {
//   const [data, setData] = useState<{[key: string]: string}>();
//   useEffect(() => {
//         // イベントリスナーを追加するにはonを使う
//     ref.on('value', snapshot => {
//             // パスに対する全データを含むsnapshotが渡される
//             // ない場合はnullが変えるので存在をチェックしておく
//       if (snapshot?.val()) {
//         setData(snapshot.val());
//       }
//     });
//     return () => {
//       ref.off();
//     };
//     // refの変更に応じて再取得する
//   }, [ref, user]);
//     // データを返却する
//   return data;
// }

// const useAllEffect = () => {
//   const [user, setUser] = useState<object | null>(null);
//   useEffect(() => {
//     firebase.auth().signInAnonymously().catch( (error) => {
//       console.log(`[error] Can not signin anonymouse (${error.code}:${error.message})`);
//     });
//
//         // 現在ログインしているユーザを取得
//     firebase.auth().onAuthStateChanged(user => {
//       // ユーザ情報が取れればログイン状態
//       setUser(user);
//     });
//   }, [])
//
//   // refを取得して
//   const ref = useDatabase();
//   // ref渡してデータを取得する
//   const data = useFetchData(ref, user);
//
//   return [user, data];
// }

// const login = () => {
//   const [user, setUser] = useState<object | null>()
//   useEffect(() => {
//     firebase.auth().signInAnonymously().catch((error) => {
//       console.log(`[error] Can not signin anonymouse (${error.code}:${error.message})`);
//     })
//
//     firebase.auth().onAuthStateChanged(user => {
//       setUser(user)
//     });
//   }, [])
//   return user;
// }

type Props = {
  userId: string;
}

export default function Home({ userId }: Props) {
  const router = useRouter()

  const createRoom = () => {
    console.log('clicked')
    const roomId = nanoid(10)
    firebase.database().ref('rooms/' + roomId).set(true)
    router.push(roomId)
  }

  return <button type="button" onClick={createRoom}>スクラムポーカーを始める</button>;

  // const { data: { user } } = useSWR('');

  // const { data, error } = useSWR('/');
  // const [user, data] = useAllEffect();
  // const dataList = useMemo(() => Object.entries(data || {}).map(([key, value]) => ({ key, value })), [data]);

  // if (!user) {
  //   return <div>not logged in</div>
  // }

  // return <dl>{dataList.map(({ key, value }) =>
  //   <React.Fragment key={`${key}${value}`}>
  //     <dt>key: {key}</dt>
  //     <dt>value: {value}</dt>
  //   </React.Fragment>
  // )}</dl>
}
