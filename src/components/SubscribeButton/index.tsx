import { signin, useSession } from 'next-auth/client'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();
  
  function handleSunscribe() {
    if (!session) {
      signin('github')

      return
    }

    //criação da checkout session
    

  }

  return (
    <button
      type='button'
      className={styles.subscribeButton}
      onClick={handleSunscribe}
    >
      Subscribe now
    </button>
  )
}