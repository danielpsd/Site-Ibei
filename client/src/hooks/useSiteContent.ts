import { trpc } from "@/lib/trpc";

/**
 * Busca o conteúdo editável de uma seção da Home (salvo pelo painel admin).
 * Se o admin nunca editou essa seção, usa os valores padrão (defaults).
 */
export function useSiteContent<T>(section: string, defaults: T): T {
  const { data } = trpc.content.get.useQuery({ section });
  return (data as T) ?? defaults;
}
