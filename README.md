# Πλήρης Εφαρμογή Web (Full Stack Web Application) - Επισκόπηση Έργου

Αυτό το έγγραφο εξηγεί την αρχιτεκτονική και τη ροή επικοινωνίας μεταξύ του frontend (React) και του backend (Spring Boot) αυτής της πλήρους εφαρμογής. Η κατανόηση αυτής της σύνδεσης είναι ζωτικής σημασίας για τη διενέργεια μελλοντικών τροποποιήσεων και προσθηκών.

## 1. Δομή Εφαρμογής

Το έργο χωρίζεται σε δύο κύρια μέρη:

*   **Frontend (`frontend/` φάκελος):**
    *   **Τεχνολογία:** React.js (JavaScript) με Vite για την ανάπτυξη.
    *   **Σκοπός:** Αυτή είναι η διεπαφή χρήστη (UI) με την οποία αλληλεπιδρούν οι χρήστες στον περιηγητή τους. Χειρίζεται την εμφάνιση δεδομένων, την εισαγωγή από τον χρήστη και την πλοήγηση.
    *   **Βασικά Αρχεία/Φάκελοι:**
        *   `frontend/public/`: Περιέχει στατικά αρχεία που σερβίρονται απευθείας (π.χ. εικόνες, `vite.svg`).
        *   `frontend/src/`: Περιέχει όλο τον κώδικα React components, σελίδες και τη λογική της εφαρμογής.
            *   `frontend/src/App.jsx`: Το κύριο component της εφαρμογής που ορίζει τις διαδρομές (routes) και τη δομή των σελίδων.
            *   `frontend/src/main.jsx`: Το σημείο εισόδου της εφαρμογής React, όπου γίνεται το rendering του `App.jsx` στο DOM.
            *   `frontend/src/index.css`: Το κύριο αρχείο CSS για την εφαρμογή.
            *   `frontend/src/App.css`: Αρχείο CSS ειδικά για το `App` component.
            *   `frontend/src/assets/`: Περιέχει στατικά assets όπως εικόνες (π.χ. `react.svg`).
            *   `frontend/src/pages/`: Περιέχει τα κύρια components που αναπαριστούν τις σελίδες της εφαρμογής.
                *   `Login.jsx`: Σελίδα σύνδεσης χρήστη.
                *   `Register.jsx`: Σελίδα εγγραφής νέου χρήστη.
                *   `Dashboard.jsx`: Η αρχική σελίδα μετά τη σύνδεση.
                *   `Customers.jsx`: Σελίδα διαχείρισης πελατών.
                *   `Devices.jsx`: Σελίδα διαχείρισης συσκευών.
                *   `Users.jsx`: Σελίδα διαχείρισης χρηστών (για Supervisors).
                *   `Tasks.jsx`: Σελίδα διαχείρισης εργασιών/αιτημάτων.
                *   `ChangePassword.jsx`: Σελίδα αλλαγής κωδικού πρόσβασης.
                *   `CustomerDevices.jsx`: Σελίδα που εμφανίζει τις συσκευές ενός συγκεκριμένου πελάτη.
            *   `frontend/src/components/`: Περιέχει επαναχρησιμοποιήσιμα UI components.
                *   `Navbar.jsx`: Η γραμμή πλοήγησης της εφαρμογής.
                *   `PrivateRoute.jsx`: Component που προστατεύει διαδρομές, επιτρέποντας πρόσβαση μόνο σε συνδεδεμένους χρήστες.
                *   `CustomerFormModal.jsx`: Modal φόρμα για τη δημιουργία/επεξεργασία πελατών.
                *   `DeviceFormModal.jsx`: Modal φόρμα για τη δημιουργία/επεξεργασία συσκευών.
                *   `UserFormModal.jsx`: Modal φόρμα για την επεξεργασία στοιχείων χρήστη.
                *   `TaskFormModal.jsx`: Modal φόρμα για τη δημιουργία/προβολή εργασιών.
                *   `AssignToPartnerModal.jsx`: Modal φόρμα για την ανάθεση συσκευής σε συνεργάτη.
        *   `frontend/vite.config.js`: Αρχείο ρύθμισης του Vite, συμπεριλαμβανομένων των ρυθμίσεων proxy (αν υπάρχουν).
        *   `frontend/package.json`: Καθορίζει τις εξαρτήσεις του έργου και τα scripts για την εκτέλεση της εφαρμογής frontend.
        *   `frontend/package-lock.json`: Καταγράφει τις ακριβείς εκδόσεις των εξαρτήσεων.
        *   `frontend/.gitignore`: Καθορίζει αρχεία/φακέλους που πρέπει να αγνοηθούν από το Git.
        *   `frontend/eslint.config.js`: Ρυθμίσεις για το ESLint, ένα εργαλείο για την ανάλυση κώδικα.
        *   `frontend/index.html`: Το κύριο αρχείο HTML που φορτώνει την εφαρμογή React.
        *   `frontend/README.md`: Το αρχικό README για το frontend project.
        *   `frontend/tailwind.config.js`: Ρυθμίσεις για το Tailwind CSS.
    *   **Επικοινωνία:** Στέλνει αιτήματα στο backend και λαμβάνει απαντήσεις. **Δεν έχει άμεση πρόσβαση στη βάση δεδομένων.**

*   **Backend (`backend/` φάκελος):**
    *   **Τεχνολογία:** Spring Boot (Java) με Maven για τη διαχείριση του build.
    *   **Σκοπός:** Αυτό είναι το "server-side" ή ο "εγκέφαλος" της εφαρμογής. Είναι υπεύθυνο για:
        *   **Επιχειρηματική Λογική:** Υλοποίηση των βασικών κανόνων και διαδικασιών της εφαρμογής.
        *   **Επιμονή Δεδομένων:** Αλληλεπίδραση με τη βάση δεδομένων (MySQL) για αποθήκευση και ανάκτηση δεδομένων.
        *   **Ασφάλεια:** Χειρισμός της αυθεντικοποίησης (σύνδεση, εγγραφή) και εξουσιοδότησης (τι επιτρέπεται να κάνει ένας χρήστης).
        *   **Παροχέας API:** Έκθεση δεδομένων και λειτουργικότητας στο frontend μέσω σαφώς καθορισμένων APIs (Application Programming Interfaces).
    *   **Βασικά Αρχεία/Φάκελοι:**
        *   `backend/pom.xml`: Το κύριο αρχείο ρύθμισης του Maven, καθορίζει τις εξαρτήσεις του έργου και τον τρόπο build.
        *   `backend/src/main/java/com/example/demo/`: Περιέχει τον κύριο κώδικα Java.
            *   `backend/src/main/java/com/example/demo/DemoApplication.java`: Το σημείο εισόδου της εφαρμογής Spring Boot.
            *   `backend/src/main/java/com/example/demo/model/`: **Entities** (κλάσεις Java που αναπαριστούν πίνακες βάσης δεδομένων).
                *   `User.java`: Αναπαριστά έναν χρήστη της εφαρμογής.
                *   `Customer.java`: Αναπαριστά έναν πελάτη.
                *   `Device.java`: Αναπαριστά μια συσκευή.
                *   `Task.java`: Αναπαριστά μια εργασία/αίτημα.
            *   `backend/src/main/java/com/example/demo/repository/`: **Repositories** (Interfaces για την αλληλεπίδραση με τη βάση δεδομένων).
                *   `UserRepository.java`: Για πρόσβαση στον πίνακα `users`.
                *   `CustomerRepository.java`: Για πρόσβαση στον πίνακα `customers`.
                *   `DeviceRepository.java`: Για πρόσβαση στον πίνακα `devices`.
                *   `TaskRepository.java`: Για πρόσβαση στον πίνακα `tasks`.
            *   `backend/src/main/java/com/example/demo/dto/`: **Data Transfer Objects (DTOs)** (κλάσεις Java που χρησιμοποιούνται για τη μεταφορά δεδομένων μεταξύ των επιπέδων, ειδικά μεταξύ frontend και backend).
                *   `AuthenticationRequest.java`, `AuthenticationResponse.java`: Για τη σύνδεση.
                *   `RegisterRequest.java`: Για την εγγραφή.
                *   `CustomerDto.java`, `CustomerCreateRequest.java`, `CustomerUpdateRequest.java`: Για τους πελάτες.
                *   `DeviceDto.java`, `DeviceCreateRequest.java`: Για τις συσκευές.
                *   `UserDto.java`, `UserSelectionDto.java`, `UserUpdateRequest.java`, `PasswordChangeRequest.java`, `ResetPasswordRequest.java`: Για τους χρήστες.
                *   `VatLookupResponse.java`: Για την απάντηση αναζήτησης ΑΦΜ.
                *   `TaskDto.java`, `TaskCreateRequest.java`, `TaskUpdateRequest.java`: Για τις εργασίες.
            *   `backend/src/main/java/com/example/demo/service/`: **Services** (κλάσεις που περιέχουν την κύρια επιχειρηματική λογική).
                *   `AuthenticationService.java`: Χειρίζεται τη λογική αυθεντικοποίησης και εγγραφής.
                *   `CustomerService.java`: Χειρίζεται τη λογική διαχείρισης πελατών.
                *   `DeviceService.java`: Χειρίζεται τη λογική διαχείρισης συσκευών.
                *   `UserService.java`: Χειρίζεται τη λογική διαχείρισης χρηστών.
                *   `AadeVatLookupService.java`: Χειρίζεται την επικοινωνία με την υπηρεσία ΑΑΔΕ για αναζήτηση ΑΦΜ.
                *   `TaskService.java`: Χειρίζεται τη λογική διαχείρισης εργασιών.
            *   `backend/src/main/java/com/example/demo/controller/`: **Controllers** (κλάσεις που ορίζουν τα REST API endpoints).
                *   `AuthenticationController.java`: Endpoints για σύνδεση/εγγραφή.
                *   `CustomerController.java`: Endpoints για διαχείριση πελατών.
                *   `DeviceController.java`: Endpoints για διαχείριση συσκευών.
                *   `UserController.java`: Endpoints για διαχείριση χρηστών.
                *   `VatLookupController.java`: Endpoint για αναζήτηση ΑΦΜ.
                *   `TaskController.java`: Endpoints για διαχείριση εργασιών.
            *   `backend/src/main/java/com/example/demo/config/`: **Configuration** (κλάσεις ρύθμισης).
                *   `SecurityConfig.java`: Ρυθμίσεις ασφαλείας για το Spring Security (ποια endpoints είναι προσβάσιμα, ποιοι ρόλοι έχουν πρόσβαση).
                *   `JwtUtil.java`: Βοηθητική κλάση για τη δημιουργία και επικύρωση JWT (JSON Web Tokens).
                *   `JwtRequestFilter.java`: Φίλτρο που αναχαιτίζει τα αιτήματα για να επικυρώσει τα JWT.
            *   `backend/src/main/java/com/example/demo/exception/`: **Exceptions** (κλάσεις για χειρισμό εξαιρέσεων).
                *   `GlobalExceptionHandler.java`: Χειρίζεται εξαιρέσεις σε όλη την εφαρμογή και επιστρέφει κατάλληλες απαντήσεις σφάλματος.
        *   `backend/src/main/resources/`: Περιέχει αρχεία πόρων.
            *   `application.properties`: Κύριο αρχείο ρύθμισης για το Spring Boot (σύνδεση βάσης δεδομένων, θύρα server, logging, κ.λπ.).
            *   `data.sql`: SQL script για την αρχική συμπλήρωση της βάσης δεδομένων.

## 2. Πώς Επικοινωνούν Frontend και Backend (APIs)

Το frontend και το backend επικοινωνούν χρησιμοποιώντας **αιτήματα HTTP** και τη μορφή δεδομένων **JSON** (JavaScript Object Notation).

1.  **Το Frontend στέλνει Αιτήματα HTTP:**
    *   Όταν κάνετε κλικ σε ένα κουμπί, φορτώνετε μια σελίδα ή υποβάλλετε μια φόρμα, το frontend στέλνει ένα αίτημα HTTP σε μια συγκεκριμένη διεύθυνση URL (ένα API endpoint) στο backend.
    *   Κοινές μέθοδοι HTTP:
        *   `GET`: Για ανάκτηση δεδομένων (π.χ., λήψη λίστας πελατών).
        *   `POST`: Για δημιουργία νέων δεδομένων (π.χ., δημιουργία νέας συσκευής).
        *   `PUT`: Για ενημέρωση υπαρχόντων δεδομένων (π.χ., ενημέρωση προφίλ χρήστη).
        *   `DELETE`: Για διαγραφή δεδομένων (π.χ., διαγραφή εργασίας).
    *   Τα αιτήματα συχνά περιλαμβάνουν δεδομένα στο σώμα του αιτήματος (για `POST`/`PUT`) ή ως παραμέτρους URL (για `GET`).
    *   **Αυθεντικοποίηση:** Για τα περισσότερα αιτήματα, το frontend περιλαμβάνει ένα **JWT (JSON Web Token)** στην κεφαλίδα `Authorization` (`Bearer <το_token_σας>`) για να αποδείξει την ταυτότητα και τα δικαιώματα του χρήστη.

2.  **Το Backend Επεξεργάζεται τα Αιτήματα και στέλνει Απαντήσεις HTTP:**
    *   Οι **Controllers** του backend λαμβάνουν τα εισερχόμενα αιτήματα HTTP.
    *   Το Spring Security (`SecurityConfig`, `JwtRequestFilter`) ελέγχει πρώτα το JWT για να αυθεντικοποιήσει και να εξουσιοδοτήσει τον χρήστη.
    *   Ο Controller καλεί την κατάλληλη μέθοδο **Service** για να εκτελέσει την ζητούμενη λειτουργία.
    *   Το Service αλληλεπιδρά με τα **Repositories** για πρόσβαση στη βάση δεδομένων.
    *   Μετά την επεξεργασία, το Service επιστρέφει δεδομένα (συχνά ως DTOs) στον Controller.
    *   Ο Controller στη συνέχεια στέλνει μια απάντηση HTTP πίσω στο frontend. Αυτή η απάντηση συνήθως περιλαμβάνει:
        *   Έναν **Κωδικό Κατάστασης HTTP** (π.χ., `200 OK` για επιτυχία, `201 Created` για νέους πόρους, `400 Bad Request` για μη έγκυρη είσοδο, `401 Unauthorized` για ελλιπή/μη έγκυρη αυθεντικοποίηση, `403 Forbidden` για ανεπαρκή δικαιώματα, `404 Not Found`).
        *   Δεδομένα σε μορφή **JSON** στο σώμα της απάντησης.

**Παράδειγμα Ροής: Ανάκτηση Στοιχείων Πελάτη**

1.  **Frontend (`CustomerDevices.jsx`):** Όταν πλοηγείστε στη σελίδα συσκευών ενός πελάτη, χρειάζεται τα στοιχεία του πελάτη.
2.  **Frontend Αίτημα:** Στέλνει ένα αίτημα `GET` στη διεύθυνση `http://192.168.1.8:8080/api/customers/{customerId}`. Περιλαμβάνει το JWT στην κεφαλίδα `Authorization`.
3.  **Backend (`CustomerController.java`):** Η μέθοδος `getCustomerById` λαμβάνει το αίτημα.
4.  **Backend Ασφάλεια:** Το Spring Security ελέγχει το JWT και την `@PreAuthorize` annotation στη μέθοδο `getCustomerById` (`@PreAuthorize("hasAnyRole('SUPERVISOR', 'PARTNER')")`) για να διασφαλίσει ότι ο χρήστης επιτρέπεται.
5.  **Backend Service (`CustomerService.java`):** Καλέιται η μέθοδος `getCustomerById` στο service. Ανακτά την οντότητα `Customer` από το `CustomerRepository`.
6.  **Backend Μετατροπή DTO:** Η οντότητα `Customer` μετατρέπεται σε `CustomerDto` (το οποίο περιέχει μόνο τα απαραίτητα πεδία για το frontend).
7.  **Backend Απάντηση:** Ο `CustomerController` στέλνει μια απάντηση `200 OK` με το `CustomerDto` σε μορφή JSON πίσω στο frontend.
8.  **Frontend Επεξεργασία:** Το `CustomerDevices.jsx` λαμβάνει το JSON, ενημερώνει την κατάστασή του και εμφανίζει το όνομα του πελάτη.

## 3. Πού να Κάνετε Αλλαγές / Προσθήκες Νέων Λειτουργιών

Η κατανόηση της ροής επικοινωνίας σας βοηθά να αποφασίσετε πού να κάνετε αλλαγές:

*   **Σενάριο Α: Προσθήκη νέου τύπου δεδομένων ή πολύπλοκης επιχειρηματικής λογικής (π.χ., ένα νέο σύστημα "Παραγγελιών", πολύπλοκοι υπολογισμοί):**
    *   **Ξεκινήστε από το Backend.**
    *   Δημιουργήστε νέες **Entities** (`Order.java`), **Repositories** (`OrderRepository.java`), **DTOs** (`OrderDto.java`, `OrderCreateRequest.java`), **Services** (`OrderService.java`) και **Controllers** (`OrderController.java`).
    *   Ορίστε τα API endpoints (`@GetMapping`, `@PostMapping`, κ.λπ.) στον Controller.
    *   Υλοποιήστε την επιχειρηματική λογική στο Service.
    *   Διασφαλίστε την κατάλληλη ασφάλεια (`@PreAuthorize`) στον Controller ή στο Service.
    *   Ενημερώστε το `SecurityConfig.java` εάν τα νέα endpoints χρειάζονται συγκεκριμένη δημόσια πρόσβαση ή διαφορετικούς κανόνες εξουσιοδότησης.

*   **Σενάριο Β: Τροποποίηση του τρόπου εμφάνισης υπαρχόντων δεδομένων, προσθήκη νέων πεδίων σε υπάρχουσες φόρμες ή αλλαγή της συμπεριφοράς του UI:**
    *   **Ξεκινήστε από το Frontend.**
    *   Τροποποιήστε υπάρχοντα **React Components** (π.χ., `Customers.jsx`, `DeviceFormModal.jsx`) για να προσθέσετε νέα πεδία εισόδου, να εμφανίσετε νέα σημεία δεδομένων ή να αλλάξετε τη διάταξη.
    *   Εάν τα νέα σημεία δεδομένων δεν είναι ακόμη διαθέσιμα από το backend, θα πρέπει να επιστρέψετε στο **Σενάριο Α** για να επεκτείνετε τα DTOs και τα services του backend.
    *   Εάν προσθέτετε μια εντελώς νέα οθόνη, δημιουργήστε νέες **React Pages** (π.χ., `NewReportPage.jsx`).
    *   Ενημερώστε τις **κλήσεις API** (`axios.get`, `axios.post`, κ.λπ.) ώστε να ταιριάζουν με τυχόν αλλαγές στα backend endpoints ή στα DTOs.
    *   Ενημερώστε τις **διαδρομές του React Router** (`App.jsx`) εάν προσθέτετε νέες σελίδες.
    *   Ενημερώστε το **Navbar** (`Navbar.jsx`) εάν θέλετε να προσθέσετε νέους συνδέσμους πλοήγησης.

*   **Σενάριο Γ: Εντοπισμός σφαλμάτων (π.χ., σφάλμα 403 Forbidden):**
    *   **Ελέγξτε την κονσόλα προγραμματιστή του περιηγητή (F12 -> καρτέλα Network):** Δείτε ποιο αίτημα απέτυχε και ποιον κωδικό κατάστασης επέστρεψε.
    *   **Ελέγξτε τα logs του backend server (κονσόλα IntelliJ):** Αναζητήστε stack traces ή μηνύματα σφάλματος που αντιστοιχούν στο αποτυχημένο αίτημα.
    *   **Ανιχνεύστε το αίτημα:** Ακολουθήστε τη διαδρομή από την κλήση API του frontend, μέσω του Controller, Service και Repository του backend, ελέγχοντας τις annotations ασφαλείας (`@PreAuthorize`) και την επιχειρηματική λογική σε κάθε βήμα.

Ακολουθώντας αυτή τη δομημένη προσέγγιση, μπορείτε να διαχειριστείτε και να επεκτείνετε αποτελεσματικά την πλήρη εφαρμογή σας.