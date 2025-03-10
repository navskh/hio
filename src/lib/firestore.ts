import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  runTransaction,
  getDocs,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// 제품 데이터 타입 정의
export interface Product {
  id: string;
  name: string;
  category: string;
  tags: string[];
  location: string;
  houseId: string;
  description: string;
}

// 다음 제품 ID 가져오기
async function getNextProductId() {
  const counterRef = doc(db, 'counters', 'products');

  try {
    const result = await runTransaction(db, async transaction => {
      const counterDoc = await transaction.get(counterRef);
      const currentCount = counterDoc.exists() ? counterDoc.data().count : 0;
      const nextCount = currentCount + 1;

      transaction.set(counterRef, { count: nextCount });

      return `P${String(nextCount).padStart(6, '0')}`; // P000001 형식
    });

    return result;
  } catch (error) {
    console.error('ID 생성 중 오류 발생:', error);
    throw error;
  }
}

// Firestore에 제품 추가
export const addProduct = async (productData: Omit<Product, 'id'>) => {
  try {
    const id = await getNextProductId();
    const product: Product = {
      ...productData,
      id,
    };

    const docRef = await addDoc(collection(db, 'products'), product);
    console.log('제품 추가 완료! ID:', id);
    return id;
  } catch (error) {
    console.error('제품 추가 중 오류 발생:', error);
    throw error;
  }
};

export const getProducts = async () => {
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map(doc => doc.data() as Product);
};

export const deleteProduct = async (id: string) => {
  //  product안에 있는 id 값으로 찾아야 함.
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  const productRef = snapshot.docs.find(doc => doc.data().id === id);
  if (productRef) {
    await deleteDoc(productRef.ref);
  }
};

export const updateProduct = async (
  id: string,
  productData: Partial<Product>,
) => {
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  const productRef = snapshot.docs.find(doc => doc.data().id === id);
  if (productRef) {
    await updateDoc(productRef.ref, productData);
  }
};
