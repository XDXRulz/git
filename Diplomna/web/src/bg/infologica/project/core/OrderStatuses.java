package bg.infologica.project.core;

/**
 * Created by XDX on 2/5/14.
 */
public class OrderStatuses {
    public static final int NEW = 1;	// нова
    public static final int PROCESSING = 2;	// в процес на обработка
    public static final int FINISHED = 3;	// приключена
    public static final int PAYED = 4;	// платена
    public static final int DECLINED = 99;	// прекратена

    public static String getStatusName(int statusCode)
    {
        switch (statusCode){
            case 1:return "Нова поръчка";
            case 2:return "Поръчка в процес на обработка";
            case 3:return "Приключена поръчка";
            case 4:return "Платена поръчка";
            case 99:return "Прекратена поръчка";
            default:return "Липсващ статус";
        }
    }
    private OrderStatuses() {
        // dummy constructor
    }
}
