package bg.infologica.project.utils;

/**
 * Статични методи за преобразуване на данни в шестнадесетичен вид.
 *
 * @author Кальо Катеров
 * @version 2012-02-04 Първа версия.
 */
public final class Hex {

    public static final char[] HEX = {'0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'};

    /**
     * Преобразува зададен масив от байтове в шестнадесетичен вид.
     *
     * @param in Масив от байтове, който да се преобразува.
     * @return Преобразуваният масив в шестнадесетичен вид.
     */
    public static String get(byte[] in) {
        StringBuilder res = new StringBuilder("");
        if (in != null) {
            for(byte b : in) {
                res.append(HEX[((int)b & 0x000000FF) / 16])
                        .append(HEX[((int) b & 0x000000FF) % 16]);
            }
        }
        return res.toString();
    }

    /**
     * Преобразува зададен масив от байтове в шестнадесетичен вид.
     *
     * @param values Масив от байтове, който да се преобразува.
     * @return Преобразуваният масив в шестнадесетичен вид.
     */
    public static String get(int[] values) {
        StringBuilder res = new StringBuilder("");
        if (values != null) {
            for(int i : values) {
                res.append(HEX[(i & 0x000000FF) / 16])
                        .append(HEX[(i & 0x000000FF) % 16]);
            }
        }
        return res.toString();
    }

    // Dummy constructor.
    private Hex() {}

}
